import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProgressBarModule } from 'primeng/progressbar';

import { finalize } from 'rxjs';

import { IDetailRequest } from '../../../../infrastructure';
import { RetentionService } from '../../../services';
import { AsfiRequest } from '../../../../domain';

@Component({
  selector: 'app-request-detail-dialog',
  imports: [CommonModule, ProgressBarModule],
  template: `
    <div>
      <div class="px-4 sm:px-0">
        <h3 class="text-base/7 font-semibold">
          Solicitud: {{ request.requestCode }}
        </h3>
        <p class="mt-1 max-w-2xl text-lg text-gray-500">
          Registrado el {{ request.createdAt | date : 'short' }}
        </p>
      </div>
      <div class="mt-6 border-t border-gray-100">
        @if(isLoading()){
        <div class="card">
          <p-progressbar mode="indeterminate" [style]="{ height: '6px' }" />
        </div>
        } @else {
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-md font-medium">Tipo solicitud</dt>
            <dd class="mt-1 text-md text-gray-700 sm:col-span-2 sm:mt-0">
              {{ request.processTypeLabel }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-md font-medium">Estado</dt>
            <dd class="mt-1 text-md text-gray-700 sm:col-span-2 sm:mt-0">
              {{ detail()?.Estado }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-md font-medium">Descripcion</dt>
            <dd class="mt-1 text-md text-gray-700 sm:col-span-2 sm:mt-0">
              {{ detail()?.ErrorEnvio }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-md font-medium">Circular</dt>
            <dd class="mt-1 text-md text-gray-700 sm:col-span-2 sm:mt-0">
              @if( detail()?.Circular){
              {{ detail()?.Circular }}
              } @else {
              <span class=" text-red-500">SIN PROCESAR</span>
              }
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-md font-medium">Fecha circular</dt>
            <dd class="mt-1 text-md text-gray-700 sm:col-span-2 sm:mt-0">
              {{ detail()?.FechaCircular }}
            </dd>
          </div>
        </dl>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDetailDialogComponent implements OnInit {
  private retentionService = inject(RetentionService);
  request: AsfiRequest = inject(DynamicDialogConfig).data;

  detail = signal<IDetailRequest | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.getDetail();
  }

  getDetail() {
    this.retentionService
      .getDetailRequest(this.request.requestId, this.getTypeRequest())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => {
        this.detail.set(data);
      });
  }

  private getTypeRequest(): 1 | 2 | 4 {
    switch (this.request.processType) {
      case 'R':
        return 1;
      case 'S':
        return 2;
      default:
        return 4;
    }
  }
}

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

import { IDetailRequest } from '../../../infrastructure';
import { SirefoService } from '../../services';
import { AsfiRequest } from '../../../domain';

export interface requestDetail {
  requestId: number;
  processType?: string;
  requestCode: string;
  createdAt: Date;
}

@Component({
  selector: 'app-request-detail-dialog',
  imports: [CommonModule, ProgressBarModule],
  template: `
    <div>
      <div class="px-4 sm:px-0">
        <h3 class="text-base/7 font-semibold">
          Solicitud: {{ data.requestCode }}
        </h3>
        <p class="mt-1 max-w-2xl text-lg text-gray-500">
          Registrado el {{ data.createdAt | date : 'short' }}
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
              {{ processTypeLabel }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-md font-medium">Estado</dt>
            <dd class="mt-1 text-md text-gray-700 sm:col-span-2 sm:mt-0">
              {{ detailRequest()?.Estado ?? '-----' }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-md font-medium">Descripcion</dt>
            <dd class="mt-1 text-md text-gray-700 sm:col-span-2 sm:mt-0">
              {{ detailRequest()?.ErrorEnvio ?? '-----' }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-md font-medium">Circular</dt>
            <dd class="mt-1 text-md text-gray-700 sm:col-span-2 sm:mt-0">
              @if( detailRequest()?.Circular){
              {{ detailRequest()?.Circular }}
              } @else {
              <span class=" text-red-500">SIN PROCESAR</span>
              }
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-md font-medium">Fecha circular</dt>
            <dd class="mt-1 text-md text-gray-700 sm:col-span-2 sm:mt-0">
              {{ detailRequest()?.FechaCircular ?? '-----' }}
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
  private retentionService = inject(SirefoService);
  data: requestDetail = inject(DynamicDialogConfig).data;

  detailRequest = signal<IDetailRequest | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.getDetail();
  }

  getDetail() {
    this.retentionService
      .getDetailRequest(this.data.requestId, this.getTypeRequest())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => {
        this.detailRequest.set(data);
      });
  }

  private getTypeRequest(): 1 | 2 | 4 {
    switch (this.data.processType) {
      case 'R':
        return 1;
      case 'S':
        return 2;
      default:
        return 4;
    }
  }

  get processTypeLabel(): string {
    switch (this.data.processType) {
      case 'R':
        return 'Retencion';
      case 'S':
        return 'Suspension';
      default:
        return 'Remision';
    }
  }
}

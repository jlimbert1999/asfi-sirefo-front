import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';

import { SirefoService } from '../../services';
import { IRequestStatusItem } from '../../../infrastructure';

@Component({
  selector: 'app-request-list',
  imports: [TableModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './request-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RequestListComponent implements OnInit {
  private retentionService = inject(SirefoService);
  datasource = signal<IRequestStatusItem[]>([]);

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.retentionService.consultarListaEstadoEnvio().subscribe((data: any) => {
      this.datasource.set(data);
    });
  }
}

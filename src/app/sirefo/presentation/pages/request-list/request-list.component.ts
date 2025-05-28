import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';

import { SirefoService } from '../../services';
import { IRequestStatusItem } from '../../../infrastructure';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-list',
  imports: [
    FormsModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DatePickerModule,
  ],
  templateUrl: './request-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RequestListComponent implements OnInit {
  private retentionService = inject(SirefoService);
  datasource = signal<IRequestStatusItem[]>([]);

  date = new Date();

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.retentionService
      .consultarListaEstadoEnvio(this.date)
      .subscribe((data) => {
        this.datasource.set(data);
      });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


}

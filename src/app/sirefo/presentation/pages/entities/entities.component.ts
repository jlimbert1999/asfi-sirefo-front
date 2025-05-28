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

import { asfiEntities } from '../../../infrastructure';
import { SirefoService } from '../../services';

@Component({
  selector: 'app-entities',
  imports: [TableModule, IconFieldModule, InputTextModule, InputIconModule],
  template: `
    <div class="flex">
      <span class="font-medium text-2xl">Entidades Vigentes</span>
    </div>
    <div class="mt-4">
      <p-table
        #dt2
        [value]="datasource()"
        [tableStyle]="{ 'min-width': '50rem' }"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10, 25, 50]"
        [globalFilterFields]="[
          'Descripcion',
          'CodigoEnvio',
          'CodigoTipoEntidad'
        ]"
      >
        <ng-template #caption>
          <div class="flex">
            <p-iconfield iconPosition="left" class="ml-auto">
              <p-inputicon>
                <i class="pi pi-search"></i>
              </p-inputicon>
              <input
                pInputText
                type="text"
                (input)="onGlobalFilter(dt2, $event)"
                placeholder="Buscar entidad"
              />
            </p-iconfield>
          </div>
        </ng-template>

        <ng-template #header>
          <tr>
            <th>Codigo Envio</th>
            <th>Descripcion</th>
            <th>Codigo Tipo</th>
            <th>Descripcion Entidad</th>
            <th>Estado</th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td>{{ item.CodigoEnvio }}</td>
            <td>{{ item.Descripcion }}</td>
            <td>{{ item.CodigoTipoEntidad }}</td>
            <td>{{ item.DescripcionTipoEntidad }}</td>
            <td>{{ item.Estado === true ? 'SI' : 'NO' }}</td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td [colSpan]="5">Sin registros</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EntitiesComponent implements OnInit {
  private sirefoService = inject(SirefoService);

  datasource = signal<asfiEntities[]>([]);
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.sirefoService.consultarEntidadVigente().subscribe((data) => {
      this.datasource.set(data);
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

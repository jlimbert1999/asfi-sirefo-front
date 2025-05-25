import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { SirefoService } from '../../services';
import { asfiEntities } from '../../../infrastructure';

@Component({
  selector: 'app-entities',
  imports: [TableModule],
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
      >
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
}

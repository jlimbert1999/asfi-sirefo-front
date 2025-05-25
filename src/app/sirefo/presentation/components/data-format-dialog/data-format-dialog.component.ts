import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'data-format-dialog',
  imports: [CommonModule, DialogModule],
  template: `
    <p-dialog
      [header]="title()"
      [(visible)]="isVisible"
      [modal]="true"
      [draggable]="false"
      [maximizable]="true"
      [style]="{ width: '50vw' }"
      [breakpoints]="{ '575px': '90vw' }"
      appendTo="body"
    >
      <div class="p-4 space-y-6 max-h-[400px]">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2 ">Cabeceras</h3>
          <table class="w-full text-sm border border-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 text-left w-48">Campo</th>
                <th class="p-2 text-left">Descripción</th>
                <th class="p-2 text-left w-24">Tipo</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr>
                <td class="p-2 text-justify">Item</td>
                <td>Identificador del ítem dentro de la solicitud</td>
                <td>Número</td>
              </tr>
              <tr>
                <td class="p-2">Nombres</td>
                <td>Requerido para persona natural</td>
                <td>Texto</td>
              </tr>
              <tr>
                <td class="p-2">Apellido Paterno</td>
                <td>Requerido para persona natural</td>
                <td>Texto</td>
              </tr>
              <tr>
                <td class="p-2">Apellido Materno</td>
                <td>Requerido para persona natural</td>
                <td>Texto</td>
              </tr>
              <tr>
                <td class="p-2">Razon Social</td>
                <td>Solo para persona jurídica</td>
                <td>Texto</td>
              </tr>
              <tr>
                <td class="p-2">Tipo Documento</td>
                <td>Tipo de documento de identidad</td>
                <td>Número</td>
              </tr>
              <tr>
                <td class="p-2">Numero Documento</td>
                <td>
                  Número del documento de identidad. Para persona extranjera
                  puede ser sólo numérico ó comenzar por "E" o "E-“
                </td>
                <td>Texto</td>
              </tr>
              <tr>
                <td class="p-2">Complemento</td>
                <td>Complemento del CI si aplica</td>
                <td>Texto</td>
              </tr>
              <tr>
                <td class="p-2">Extension</td>
                <td>Departamento de emisión del documento</td>
                <td>Texto</td>
              </tr>
              <tr>
                <td class="p-2">Monto</td>
                <td>
                  @if(mode()==='asfi-request'){ Monto que se solicita retener en
                  bolivianos (Maximo 2 Decimales) } @else { Monto que se
                  solicita remitir a la autoridad de acuerdo al código de tipo
                  de moneda }
                </td>
                <td>Número</td>
              </tr>
              <tr>
                <td class="p-2">Tipo Respaldo</td>
                <td>Tipo de respaldo</td>
                <td>Número</td>
              </tr>
              <tr>
                <td class="p-2">Documento Respaldo</td>
                <td>Número del documento de respaldo (PIET o PC)</td>
                <td>Texto</td>
              </tr>
              @if(mode()==="asfi-request"){
              <tr>
                <td class="p-2">Auto Conclusion</td>
                <td>
                  Número del auto de conclusión con el que se realiza la
                  suspensión de la medida de retención de fondos.
                </td>
                <td>Texto</td>
              </tr>
              } @if(mode()==="asfi-request-transfer"){
              <tr>
                <td class="p-2">Numero Cuenta</td>
                <td>
                  Número de cuenta de la cual la autoridad solicita que se
                  realice la remisión de fondos
                </td>
                <td>Texto</td>
              </tr>
              <tr>
                <td class="p-2">Cuenta Moneda</td>
                <td>
                  Moneda de la cuenta de la cual se realizará la remisión de
                  fondos
                </td>
                <td>Texto</td>
              </tr>
              <tr>
                <td class="p-2">Codigo Envio</td>
                <td>
                  Identificador único asignado a la entidad por ASFI.
                  <strong>Ver (Entidades Vigentes)</strong>
                </td>
                <td>Texto</td>
              </tr>
              }
            </tbody>
          </table>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-800 mt-6 mb-2">
            Valores Permitidos
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-1">
                Tipo Documento
              </h4>
              <ul class="text-sm list-disc list-inside">
                <li>1 – NIT (Jurídica)</li>
                <li>2 – Cédula de Identidad (Natural)</li>
                <li>3 – RUC (Jurídica)</li>
                <li>4 – Pasaporte (Natural)</li>
                <li>5 – C.I. Persona Extranjera (Natural)</li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-1">Extension</h4>
              <ul class="text-sm list-disc list-inside">
                <li>CH – Chuquisaca</li>
                <li>LP – La Paz</li>
                <li>CB – Cochabamba</li>
                <li>OR – Oruro</li>
                <li>PO – Potosí</li>
                <li>TJ – Tarija</li>
                <li>SC – Santa Cruz</li>
                <li>BE – Beni</li>
                <li>PA – Pando</li>
                <li>PE – Persona Extranjera (Solo documento 2 y 5).</li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-1">
                Tipo Respaldo
              </h4>
              <ul class="text-sm list-disc list-inside">
                <li>1 – PIET</li>
                <li>2 – PC</li>
                <li>3 – AAPA</li>
                <li>4 – RS</li>
              </ul>
            </div>
            @if(mode()==="asfi-request-transfer"){
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-1">
                Cuenta Moneda
              </h4>
              <ul class="text-sm list-disc list-inside">
                <li>1 – BOLIVIANOS</li>
                <li>2 – DOLARES ESTADOUNIDENSES</li>
                <li>3 – BOLIVIANOS CON MANTENIMIENTO DE VALOR</li>
                <li>4 – MN CON MV A LA UNIDAD DE FOMENTO DE VIVIENDA</li>
              </ul>
            </div>
            }
          </div>
        </div>
      </div>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataFormatDialogComponent {
  isVisible = model.required<boolean>();
  mode = input.required<'asfi-request' | 'asfi-request-transfer'>();

  title = computed(() =>
    this.mode() === 'asfi-request'
      ? 'Descripcion de Datos (Retención  y Suspensión)'
      : 'Descripcion de Datos (Remisión)'
  );
}

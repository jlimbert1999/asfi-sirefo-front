import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { RetentionService } from '../../services';

@Component({
  selector: 'app-methods',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
  ],
  template: `
    <div class="flex flex-col gap-y-6">
      <div class="card flex flex-col gap-y-4">
        <span class="text-3xl font-bold">Ping</span>
        <p>Probar conexion con el Web - Service</p>
        <input
          type="text"
          pInputText
          [formControl]="text"
          placeholder="Texto a enviar"
          class="max-w-[300px]"
        />
        <div class="bg-slate-100 rounded-xl min-h-[80px]">
          @if(responsePing()){
          <pre class="p-4">{{ responsePing() | json }}</pre>
          }
        </div>
        <div class="mt-2 flex justify-end">
          <p-button
            label="Enviar"
            (onClick)="send()"
            [disabled]="text.invalid"
          />
        </div>
      </div>
      <div class="card flex flex-col gap-y-2">
        <span class="text-3xl font-bold">ConsultarEntidadVigente</span>
        <p>Mostrar el listado de entidades vigentes o no en en ASFI.</p>

        <div
          class="bg-slate-100 rounded-xl min-h-[80px] max-h-[400px] overflow-y-auto"
        >
          @if(responseConsultarEntidadVigente()){
          <pre class="p-4">{{ responseConsultarEntidadVigente() | json }}</pre>
          }
        </div>
        <div class="mt-2 flex justify-end">
          <p-button label="Enviar" (onClick)="consultarEntidadVigente()" />
        </div>
      </div>

      <div class="card flex flex-col gap-y-2">
        <span class="text-3xl font-bold">ConsultarCabacera</span>
        <p>
          Obtener el máximo valor del identificador registrada por tipo de
          solicitud.
        </p>

        <div
          class="bg-slate-100 rounded-xl min-h-[80px] max-h-[400px] overflow-y-auto"
        >
          @if(responseconsultarCabacera()){
          <pre class="p-4">{{ responseconsultarCabacera() | json }}</pre>
          }
        </div>
        <div class="mt-2 flex justify-end">
          <p-button label="Enviar" (onClick)="consultarCabacera()" />
        </div>
      </div>

      <div class="card flex flex-col gap-y-2">
        <span class="text-3xl font-bold">ConsultarListadoEnvio</span>
        <p>
          Obtener el listado de las solicitudes procesadas o se encuentran
          pendientes.
        </p>

        <div
          class="bg-slate-100 rounded-xl min-h-[80px] max-h-[400px] overflow-y-auto"
        >
          @if(responseConsultarListadoEnvio()){
          <pre class="p-4">{{ responseConsultarListadoEnvio() | json }}</pre>
          }
        </div>
        <div class="mt-2 flex justify-end">
          <p-button label="Enviar" (onClick)="consultarListadoEnvio()" />
        </div>
      </div>

      <div class="card flex flex-col gap-y-2">
        <span class="text-3xl font-bold">ConsultarEstadoEnvio</span>
        <p>Consultar estado de una solicitud</p>
        <div class="flex gap-x-4">
          <input
            type="text"
            pInputText
            [formControl]="text"
            placeholder="Texto a enviar"
            [(ngModel)]="requestId"
            class="max-w-56"
          />
          <p-select
            [options]="requestTypeOptions"
            [(ngModel)]="requestType"
            placeholder="Tipo solicitud"
            class="w-full md:w-56"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div
          class="bg-slate-100 rounded-xl min-h-[80px] max-h-[400px] overflow-y-auto"
        >
          @if(responseEstadoEnvio()){
          <pre class="p-4">{{ responseEstadoEnvio() | json }}</pre>
          }
        </div>
        <div class="mt-2 flex justify-end">
          <p-button
            label="Enviar"
            (onClick)="consultarEstadoEnvio()"
            [disabled]="!requestId()"
          />
        </div>
      </div>
<!-- 
      <div class="card flex flex-col gap-y-2">
        <span class="text-3xl font-bold">ConsultarEstadoEnvio</span>
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-4">
            <input
              type="text"
              pInputText
              [formControl]="text"
              placeholder="Texto a enviar"
              [(ngModel)]="requestId"
            />
            <p-button
              label="Enviar"
              (onClick)="consultarEstadoEnvio()"
              [disabled]="!requestId()"
            />
          </div>
          @if(responseEstadoEnvio()){
          <div class="bg-slate-100 rounded-xl">
            <pre class="p-4">{{ responseEstadoEnvio() | json }}</pre>
          </div>
          }
        </div>
      </div> -->
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MethodsComponent {
  responsePing = signal<any | null>(null);
  responseConsultarEntidadVigente = signal<any | null>(null);
  responseconsultarCabacera = signal<any | null>(null);
  responseEstadoEnvio = signal<any | null>(null);
  responseConsultarListadoEnvio = signal<any | null>(null);

  private withholdingService = inject(RetentionService);

  text = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });

  requestId = signal<string | null>(null);
  requestType = signal<number | null>(null);

  requestTypeOptions = [
    { value: 1, label: 'Retencion' },
    { value: 2, label: 'Suspension' },
    { value: 4, label: 'Remision' },
  ];

  send() {
    this.withholdingService.ping(this.text.value).subscribe((resp) => {
      this.responsePing.set(resp);
    });
  }

  consultarEntidadVigente() {
    this.withholdingService.consultarEntidadVigente().subscribe((resp) => {
      this.responseConsultarEntidadVigente.set(resp);
    });
  }

  consultarCabacera() {
    this.withholdingService.consultarCabacera().subscribe((resp) => {
      this.responseconsultarCabacera.set(resp);
    });
  }

  consultarEstadoEnvio() {
    if (!this.requestId() || !this.requestType()) return;
    this.withholdingService
      .consultarEstadoEnvio(this.requestId()!, this.requestType()!)
      .subscribe((resp) => {
        this.responseEstadoEnvio.set(resp);
      });
  }

  consultarListadoEnvio() {
    this.withholdingService.consultarListaEstadoEnvio().subscribe((resp) => {
      this.responseConsultarListadoEnvio.set(resp);
    });
  }
}

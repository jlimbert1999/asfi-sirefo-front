import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

interface config {
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-message-dialog',
  imports: [ButtonModule],
  template: `
    <div class="p-dialog-content">
      <!-- <div class="flex flex-column sm:flex-row justify-content-center">
        @if(config.icon){
        <div
          class="w-full sm:w-4rem flex align-items-center justify-content-center py-3"
        >
          @switch (config.icon) { @case ('error') {
          <i class="pi pi-exclamation-triangle text-2xl text-red-600"></i>
          } @case ('warning') {
          <i class="pi pi-lock text-2xl"></i>
          }@case ('loading') {
          <i class="pi pi-spin pi-spinner text-4xl"></i>
          } @case ('security') {
          <i class="pi pi-lock text-2xl"></i>
          }@default {
          <i class="pi pi-info text-2xl"></i>
          } }
        </div>
        }

       
      </div> -->
      <div class="text-lg">
        {{ config.description }}
      </div>
    </div>
    <div class="p-dialog-footer">
      <p-button label="Aceptar" (onClick)="close()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageDialogComponent {
  private dialogRef = inject(DynamicDialogRef);

  config: config = inject(DynamicDialogConfig).data;

  close() {
    this.dialogRef.close();
  }
}

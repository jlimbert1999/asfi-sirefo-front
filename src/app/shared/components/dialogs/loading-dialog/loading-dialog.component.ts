import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-loading-dialog',
  imports: [ProgressSpinnerModule],
  template: `
    <div class="p-dialog-content">
      <div class="flex items-center">
        <p-progressSpinner
          ariaLabel="loading"
          styleClass="size-4"
          strokeWidth="5"
        />
        <div class="flex-1 ml-8 text-2xl font-medium">Por favor espere....</div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingDialogComponent {}

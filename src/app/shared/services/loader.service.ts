import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';

import { LoadingDialogComponent } from '../components/dialogs/loading-dialog/loading-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private dialogService = inject(DialogService);

  private loadingDialogRef?: DynamicDialogRef<LoadingDialogComponent> | null;
  private totalUploadRequests = 0;

  private _isLoading = new BehaviorSubject<boolean>(false);
  private totalLoadingRequests = 0;

  isLoading = toSignal(this._isLoading);

  constructor() {}

  toggleUploading(show: boolean) {
    if (show) {
      this.totalUploadRequests++;
      if (this.loadingDialogRef) return;
      this.loadingDialogRef = this.dialogService.open(LoadingDialogComponent, {
        header: 'Guardando Informacion',
        width: `25vw`,
        closable: false,
        closeOnEscape: false,
        focusOnShow: false,
        modal: true,
        breakpoints: {
          '960px': '90vw',
        },
      });
    } else {
      this.totalUploadRequests = Math.max(0, this.totalUploadRequests - 1);
      if (this.totalUploadRequests === 0) {
        this.loadingDialogRef?.close();
        this.loadingDialogRef = null;
      }
    }
  }

  toggleLoading(show: boolean) {
    if (show) {
      this.totalLoadingRequests++;
      this._isLoading.next(true);
    } else {
      this.totalLoadingRequests = Math.max(0, this.totalLoadingRequests - 1);
      if (this.totalLoadingRequests === 0) {
        this._isLoading.next(false);
      }
    }
  }
}

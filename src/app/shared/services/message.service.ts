import { inject, Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageDialogComponent } from '../components/dialogs/message-dialog/message-dialog.component';

interface alertConfig {
  header: string;
  description: string;
  width?: number;
  icon?: icons;
  closable?: boolean;
}

type icons = 'error' | 'warning' | 'success' | 'loading' | 'security';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private dialogService = inject(DialogService);

  constructor() {}

  message({ header, width = 30, closable = true, ...props }: alertConfig) {
    return this.dialogService.open(MessageDialogComponent, {
      header: header,
      data: props,
      modal: true,
      width: `${width}vw`,
      closable: false,
      breakpoints: {
        '960px': '90vw',
      },
    });
  }
}

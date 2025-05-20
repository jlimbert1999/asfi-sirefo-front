import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

interface toastProps {
  description?: string;
  title: string;
  severity: severity;
}
type severity = 'success' | 'info' | 'warn' | 'error' | 'secondary';
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  show({ description, title, severity = 'info' }: toastProps) {
    this.messageService.add({
      severity: severity,
      summary: title,
      detail: description,
    });
  }
}

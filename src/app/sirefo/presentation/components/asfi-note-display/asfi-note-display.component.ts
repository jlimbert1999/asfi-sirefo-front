import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DialogModule } from 'primeng/dialog';

import { FileUploadService } from '../../services';

@Component({
  selector: 'asfi-note-display',
  imports: [DialogModule, PdfViewerModule],
  template: `
    <p-dialog
      [header]="title()"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [(visible)]="visible"
      [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
      [style]="{ width: '50vw' }"
    >
      @if(source()){
      <pdf-viewer
        [src]="source()!"
        [render-text]="false"
        [original-size]="false"
        style="width: 100%; height: 500px"
      />
      }
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsfiNoteDisplayComponent implements OnInit {
  private fileService = inject(FileUploadService);
  private destroyRef = inject(DestroyRef);
  url = input.required<string>();
  title = input<string>('Nota Adjuntada');
  visible = model.required<boolean>();

  source = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.source()) {
        URL.revokeObjectURL(this.source()!);
      }
    });
  }

  ngOnInit(): void {
    this.fileService.getFile(this.url()).subscribe((file) => {
      const blob = new Blob([file], { type: 'application/pdf' });
      this.source.set(URL.createObjectURL(blob));
    });
  }
}

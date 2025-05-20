import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { FloatLabel } from 'primeng/floatlabel';
import { ToolbarModule } from 'primeng/toolbar';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';

import { switchMap } from 'rxjs';

import {
  ExcelService,
  AsfiRequestService,
  FileUploadService,
} from '../../../services';
import { submitRequestDetail } from '../../../../infrastructure';
import { MessageService } from '../../../../../shared';
import { AsfiRequest } from '../../../../domain';

interface excelData {
  Item: number;
  'Apellido Paterno': string;
  'Apellido Materno': string;
  Nombres: string;
  'Tipo Documento': number;
  'Numero Documento': string;
  Extension: string;
  Monto: number;
  'Tipo Respaldo': number;
  'Documento Respaldo': string;
  'Auto Conclusion': string;
  'Razon Social': string;
}

interface column {
  header: string;
  columnDef: keyof submitRequestDetail;
  width?: string;
}

@Component({
  selector: 'app-request-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepperModule,
    ButtonModule,
    TableModule,
    FileUploadModule,
    InputTextModule,
    FloatLabel,
    SelectModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    DialogModule,
  ],
  templateUrl: './request-dialog.component.html',
})
export class RequestDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private excelService = inject(ExcelService);
  private dialogRef = inject(DynamicDialogRef);
  private messageService = inject(MessageService);
  private asfiRequestService = inject(AsfiRequestService);
  private fileUploadService = inject(FileUploadService);

  data: AsfiRequest | undefined = inject(DynamicDialogConfig).data;

  readonly COLUMNS: column[] = [
    { header: 'Item', columnDef: 'item', width: '40px' },
    { header: 'Nombres', columnDef: 'firstName', width: '15rem' },
    { header: 'Apellido Paterno', columnDef: 'paternalLastName' },
    { header: 'Apellido Materno', columnDef: 'maternalLastName' },
    { header: 'Tipo Documento', columnDef: 'documentType' },
    { header: 'Numero Documento', columnDef: 'documentNumber' },
    { header: 'Complemento', columnDef: 'complement' },
    { header: 'Extension', columnDef: 'extension', width: '100px' },
    { header: 'Auto Conclusion', columnDef: 'autoConclusion' },
    { header: 'Documento Respaldo', columnDef: 'supportDocument' },
    { header: 'Razon Social', columnDef: 'businessName' },
    { header: 'Monto', columnDef: 'amount' },
    { header: 'Tipo Respaldo', columnDef: 'supportType' },
  ];

  readonly PROCESS_TYPES = [
    { value: 'R', label: 'Retención' },
    { value: 'S', label: 'Suspensión' },
  ];

  datasource = signal<submitRequestDetail[]>([]);

  form = this.formBuilder.group({
    authorityPosition: ['', Validators.required],
    requestingAuthority: ['', Validators.required],
    requestCode: ['', Validators.required],
    department: ['', Validators.required],
    processType: ['', Validators.required],
  });

  isErrorDialogShowing = signal(false);
  errorMessages = signal<string[]>([]);

  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFormData();
  }

  save() {
    if (!this.isFormValid) return;
    const subscription = this.buildSaveMethod();
    subscription.subscribe({
      next: (asfiRequest) => {
        this.dialogRef.close(asfiRequest);
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          this.handleHtttErrrors(error);
        }
      },
    });
  }

  onGlobalFilterTable(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onFileSelect(event: FileSelectEvent) {
    const [file] = event.files;
    if (file && file.type !== 'application/pdf') return;
    this.selectedFile.set(file);
    this.selectedFileName.set(file.name);
  }

  close() {
    this.dialogRef.close();
  }

  async loadExcel(event: FileSelectEvent) {
    const [file] = event.files;
    if (!file) return;
    const data: excelData[] = await this.excelService.readExcelFile(file);
    this.datasource.set(this.excelDataToDto(data));
  }

  get isFormValid() {
    return this.data
      ? this.form.valid && this.datasource().length > 0
      : this.form.valid && this.datasource().length > 0 && this.selectedFile();
  }

  private excelDataToDto(data: excelData[]): submitRequestDetail[] {
    return data.map((el) => ({
      item: el.Item.toString(),
      maternalLastName: el['Apellido Materno'],
      paternalLastName: el['Apellido Paterno'],
      autoConclusion: el['Auto Conclusion'],
      complement: el['Tipo Documento'],
      extension: el['Extension'],
      documentNumber: el['Numero Documento'],
      documentType: el['Tipo Documento'],
      supportDocument: el['Documento Respaldo'],
      amount: el['Monto'],
      firstName: el['Nombres'],
      businessName: el['Razon Social'],
      supportType: el['Tipo Respaldo'],
    }));
  }

  private handleHtttErrrors(error: HttpErrorResponse) {
    const { message } = error.error;
    switch (error.status) {
      case 409:
        const request = error.error['request'];
        this.messageService.message({
          header: 'Error al registrar la solicitud',
          description:
            typeof message === 'string' ? message : 'La solicitud es invalida',
        });
        this.dialogRef.close(request);
        break;
      case 400:
        if (Array.isArray(message)) {
          this.errorMessages.set(this.parseValidationErrors(message));
          this.isErrorDialogShowing.set(true);
        }
        break;

      default:
        break;
    }
  }

  private parseValidationErrors(errors: string[]): string[] {
    return errors.map((item) => {
      const parts = item.split('.', 3);
      if (parts.length <= 2) return parts.join('.');
      const index = parseInt(parts[1], 10);
      const mensaje = parts.slice(2).join('.');
      return `Fila ${index + 1}: ${mensaje.trim()}`;
    });
  }

  private loadFormData() {
    if (!this.data) return;
    const { file, ...props } = this.data;
    this.form.patchValue(props);
    this.selectedFileName.set(file.originalName);
  }

  private buildSaveMethod() {
    if (!this.data) {
      return this.fileUploadService
        .uploadAsfiNote(this.selectedFile()!)
        .pipe(
          switchMap((uploadedFile) =>
            this.asfiRequestService.create(
              this.form.value,
              this.datasource(),
              uploadedFile
            )
          )
        );
    }

    return this.selectedFile()
      ? this.fileUploadService.uploadAsfiNote(this.selectedFile()!).pipe(
          switchMap((uploadedFile) =>
            this.asfiRequestService.update({
              id: this.data!.id,
              form: this.form.value,
              details: this.datasource(),
              file: uploadedFile,
            })
          )
        )
      : this.asfiRequestService.update({
          id: this.data!.id,
          form: this.form.value,
          details: this.datasource(),
        });
  }
}

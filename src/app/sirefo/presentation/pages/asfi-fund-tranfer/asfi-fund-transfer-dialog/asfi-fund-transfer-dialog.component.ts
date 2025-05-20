import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { StepperModule } from 'primeng/stepper';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Select, SelectModule } from 'primeng/select';

import { map, Observable, of, switchMap } from 'rxjs';

import {
  AsfiFundTransferService,
  AsfiRequestService,
  FileUploadService,
  ExcelService,
} from '../../../services';
import {
  aprovedRequest,
  asfiFundTransferDetail,
} from '../../../../infrastructure';
import { MessageService } from '../../../../../shared';
import { AsfiFundTransfer } from '../../../../domain';

interface column {
  header: string;
  columnDef: keyof asfiFundTransferDetail;
  width?: string;
}

interface selectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-asfi-fund-transfer-dialog',
  imports: [
    CommonModule,
    FormsModule,
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
    MessageModule,
  ],
  templateUrl: './asfi-fund-transfer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsfiFundTransferDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);

  private excelService = inject(ExcelService);
  private messageService = inject(MessageService);
  private fileUploadService = inject(FileUploadService);
  private requestService = inject(AsfiFundTransferService);
  private asfiRequestService = inject(AsfiRequestService);

  readonly COLUMNS: column[] = [
    { header: 'Item', columnDef: 'item', width: '40px' },
    { header: 'Nombres', columnDef: 'firstName', width: '15rem' },
    { header: 'Apellido Paterno', columnDef: 'paternalLastName' },
    { header: 'Apellido Materno', columnDef: 'maternalLastName' },
    { header: 'Tipo Documento', columnDef: 'documentType' },
    { header: 'Numero Documento', columnDef: 'documentNumber' },
    { header: 'Complemento', columnDef: 'complement' },
    { header: 'Extension', columnDef: 'extension', width: '100px' },
    { header: 'Documento Respaldo', columnDef: 'supportDocument' },
    { header: 'Razon Social', columnDef: 'businessName' },
    { header: 'Monto', columnDef: 'amount' },
    { header: 'Tipo Respaldo', columnDef: 'supportType' },
    { header: 'Numero Cuenta', columnDef: 'accountNumber' },
    { header: 'Cuenta Moneda', columnDef: 'accountCurrency' },
    { header: 'Codigo Envio', columnDef: 'transferCode' },
  ];

  data: AsfiFundTransfer | undefined = inject(DynamicDialogConfig).data;

  datasource = signal<asfiFundTransferDetail[]>([]);

  form = this.formBuilder.group({
    authorityPosition: ['', Validators.required],
    requestingAuthority: ['', Validators.required],
    requestCode: ['', Validators.required],
    department: ['', Validators.required],
  });

  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string | null>(null);
  selectedAsfiRequest = signal<aprovedRequest | null>(null);

  isErrorDialogShowing = signal(false);
  errorMessages = signal<string[]>([]);

  aprovedRequests = signal<selectOption<aprovedRequest>[]>([]);

  constructor() {}

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
    this.selectedFile.set(file);
  }

  close() {
    this.dialogRef.close();
  }

  searchAprovedCodes(term: string) {
    if (!term) return;
    this.asfiRequestService
      .searchAprovedCodes(term)
      .pipe(
        map((resp) =>
          resp.map((item) => ({
            label: `Nro. CITE: ${item.requestCode} / Circular: ${item.circularNumber}`,
            value: item,
          }))
        )
      )
      .subscribe((data) => {
        this.aprovedRequests.set(data);
      });
  }

  onSelectAsfiRequest(item: aprovedRequest, ref: Select) {
    ref.clear();
    this.selectedAsfiRequest.set(item);
  }

  async loadExcel(event: FileSelectEvent) {
    const [file] = event.files;
    if (!file) return;
    const data = await this.excelService.readExcelFile(file);
    this.datasource.set(this.excelDataToDto(data));
  }

  get isFormValid() {
    return this.data
      ? this.form.valid && this.datasource().length > 0
      : this.form.valid && this.datasource().length > 0 && this.selectedFile();
  }

  private excelDataToDto(data: any[]): asfiFundTransferDetail[] {
    return data.map((el) => ({
      item: el.Item,
      maternalLastName: el['Apellido Materno'],
      paternalLastName: el['Apellido Paterno'],
      complement: el['Tipo Documento'],
      extension: el['Extension'],
      documentNumber: el['Numero Documento'],
      documentType: el['Tipo Documento'],
      supportDocument: el['Documento Respaldo'],
      amount: el['Monto'],
      firstName: el['Nombres'],
      businessName: el['Razon Social'],
      supportType: el['Tipo Respaldo'],
      accountNumber: el['Numero Cuenta'],
      accountCurrency: el['Cuenta Moneda'],
      transferCode: el['Codigo Envio'],
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
    const { asfiRequest, file, ...props } = this.data;
    this.form.patchValue(props);
    this.selectedAsfiRequest.set(asfiRequest);
    this.selectedFileName.set(file.originalName);
  }

  private buildSaveMethod() {
    const file = this.selectedFile();

    const upload$: Observable<{
      originalName: string;
      fileName: string;
    } | null> = file ? this.fileUploadService.uploadAsfiNote(file) : of(null);

    return upload$.pipe(
      switchMap((uploadedFile) => {
        const payload = {
          form: {
            ...this.form.value,
            asfiRequestId: this.selectedAsfiRequest()?.id,
          },
          details: this.datasource(),

          ...(uploadedFile && { file: uploadedFile }),
        };

        return this.data
          ? this.requestService.update({
              id: this.data.id,
              ...payload,
            })
          : this.requestService.create(
              payload.form,
              payload.details,
              uploadedFile!
            );
      })
    );
  }
}

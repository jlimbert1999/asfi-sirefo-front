import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { StepperModule } from 'primeng/stepper';
import { FloatLabel } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { catchError, forkJoin, of, switchMap } from 'rxjs';

import {
  ExcelService,
  FileUploadService,
  AsfiFundTransferService,
  AsfiRequestService,
} from '../../../services';

import {
  aprovedRequest,
  asfiFundTransferItem,
} from '../../../../infrastructure';

import {
  AlertService,
  FieldValidationErrorMessages,
} from '../../../../../shared';
import { AsfiFundTransfer } from '../../../../domain';
import { FormErrorMessagesPipe } from '../../../../../shared';
import { CustomFormValidators } from '../../../../../helpers';
import { AuthService } from '../../../../../auth/presentation/services/auth.service';
import { SelectSearchComponent } from '../../../../../shared/components/inputs/select-search/select-search.component';

interface column {
  header: string;
  columnDef: keyof asfiFundTransferItem;
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
    InputGroupAddonModule,
    InputGroupModule,
    FormErrorMessagesPipe,
    InputNumberModule,
    SelectSearchComponent,
  ],
  templateUrl: './asfi-fund-transfer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsfiFundTransferDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private messageService = inject(MessageService);

  private excelService = inject(ExcelService);
  private alertService = inject(AlertService);
  private fileUploadService = inject(FileUploadService);
  private requestService = inject(AsfiFundTransferService);
  private asfiRequestService = inject(AsfiRequestService);
  private user = inject(AuthService).user();

  readonly YEAR = new Date().getFullYear();
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

  protected formMessages: FieldValidationErrorMessages = {
    requestingAuthority: {
      pattern: 'Solo letras, espacios y guiones, sin caracteres especiales',
      minWords: 'Se requieren al menos 2 palabras',
    },
    authorityPosition: {
      pattern: 'Solo letras, espacios y guiones, sin caracteres especiales',
    },
  };

  data: AsfiFundTransfer | undefined = inject(DynamicDialogConfig).data;

  datasource = signal<asfiFundTransferItem[]>([]);

  form = this.formBuilder.group({
    requestingAuthority: [
      this.user?.fullName,
      [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚÑáéíóúñ' -]+$/),
        CustomFormValidators.minWordsValidator(2),
      ],
    ],
    authorityPosition: [
      this.user?.position,
      [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚÑáéíóúñ.\- ]+$/),
      ],
    ],

    requestCode: [
      '',
      [Validators.required, Validators.min(1), Validators.max(99999)],
    ],
    department: ['', Validators.required],
  });

  pdfFile = signal<File | null>(null);
  pdfFileName = signal<string | null>(null);
  selectedAsfiRequest = signal<aprovedRequest | null>(null);
  spreadsheetFile = signal<File | null>(null);

  isErrorDialogShowing = signal(false);
  errorMessages = signal<string[]>([]);
  aprovedRequests = signal<selectOption<aprovedRequest>[]>([]);

  ngOnInit(): void {
    this.loadFormData();
  }

  save() {
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

  onPdfSelect(event: FileSelectEvent) {
    const [file] = event.files;
    this.pdfFile.set(file);
    this.pdfFileName.set(file.name);
  }

  onSpreadSheetSelect(event: FileSelectEvent) {
    const [file] = event.files;
    if (!file) return;
    this.spreadsheetFile.set(file);
    const colums = this.COLUMNS.map(({ header }) => header);
    this.excelService.readExcelFile(file, colums).subscribe({
      next: (data) => {
        this.datasource.set(this.excelDataToDto(data));
      },
      error: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Formato incorrecto',
          detail: 'No se puedo cargar el archivo',
        });
      },
    });
  }

  close() {
    this.dialogRef.close();
  }

  searchAprovedRequests(term?: string) {
    this.asfiRequestService.searchAprovedCodes(term).subscribe((data) => {
      const selectOptions = data.map((item) => ({
        label: `Solicitud: ${item.requestCode} / Circular: ${item.circularNumber}`,
        value: item,
      }));
      this.aprovedRequests.set(selectOptions);
    });
  }

  onSelectAprovedRequest(item: aprovedRequest) {
    this.selectedAsfiRequest.set(item);
  }

  get isFormValid() {
    return this.data
      ? this.form.valid &&
          this.datasource().length > 0 &&
          this.selectedAsfiRequest()
      : this.form.valid &&
          this.datasource().length > 0 &&
          this.selectedAsfiRequest() &&
          this.pdfFile() &&
          this.spreadsheetFile();
  }

  private excelDataToDto(data: any[]): asfiFundTransferItem[] {
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
        this.alertService.message({
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

    const { file, dataSheetFile, asfiRequest, ...props } = this.data;

    this.form.patchValue(props);
    this.selectedAsfiRequest.set(asfiRequest);
    this.pdfFileName.set(file.originalName);

    this.fileUploadService
      .getFile(dataSheetFile)
      .pipe(
        switchMap((file) => this.excelService.readExcelFile(file)),
        catchError(() => of([]))
      )
      .subscribe((data) => {
        this.datasource.set(this.excelDataToDto(data));
      });
  }

  private buildSaveMethod() {
    return forkJoin([
      this.pdfFile()
        ? this.fileUploadService.uploadAsfiFile(this.pdfFile()!)
        : of(null),
      this.spreadsheetFile()
        ? this.fileUploadService.uploadAsfiFile(this.spreadsheetFile()!)
        : of(null),
    ]).pipe(
      switchMap(([file, dataSheetFile]) => {
        const formData = {
          ...this.form.value,
          ...(file && { file }),
          ...(dataSheetFile && { dataSheetFile: dataSheetFile.fileName }),
          asfiRequestId: this.selectedAsfiRequest()?.id,
        };

        return this.data
          ? this.requestService.update(
              this.data.id,
              formData,
              this.datasource()
            )
          : this.requestService.create(formData, this.datasource());
      })
    );
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Popover, PopoverModule } from 'primeng/popover';
import { DatePickerModule } from 'primeng/datepicker';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';

import { AsfiFundTransferDialogComponent } from './asfi-fund-transfer-dialog/asfi-fund-transfer-dialog.component';
import {
  FieldValidationErrorMessages,
  SearchInputComponent,
} from '../../../../shared';
import { AsfiFundTransferService, FileUploadService } from '../../services';
import { AsfiFundTransfer } from '../../../domain';

import { AsfiNoteDisplayComponent } from '../../components';

@Component({
  selector: 'app-asfi-fund-tranfer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    PdfViewerModule,
    PaginatorModule,
    InputIconModule,
    IconFieldModule,
    ToolbarModule,
    DialogModule,
    ButtonModule,
    TableModule,
    TagModule,
    MenuModule,
    PopoverModule,
    SelectModule,
    DatePickerModule,
    SearchInputComponent,
    AsfiNoteDisplayComponent,
  ],
  templateUrl: './asfi-fund-tranfer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AsfiFundTranferComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dialogService = inject(DialogService);
  private requestService = inject(AsfiFundTransferService);
  private fileService = inject(FileUploadService);

  popoverRef = viewChild.required<Popover>('op');

  datasource = signal<AsfiFundTransfer[]>([]);
  datasize = signal<number>(0);

  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');

  isShowingFile = signal(false);
  selectedItem = signal<AsfiFundTransfer | null>(null);

  menuOptions = signal<MenuItem[]>([]);

  protected formMessages: FieldValidationErrorMessages = {
    requestingAuthority: {
      pattern: 'Solo letras, espacios y guiones, sin caracteres especiales',
      minWords: 'Se requieren al menos 2 palabras',
    },
    authorityPosition: {
      pattern: 'Solo letras, espacios y guiones, sin caracteres especiales',
    },
  };

  filterForm: FormGroup = this.formBuilder.group({
    createdAt: [''],
    processType: [''],
    status: [''],
    isAproved: [''],
  });

  readonly PROCESS_TYPES = [
    { value: 'R', label: 'Retencion' },
    { value: 'S', label: 'Suspension' },
  ];

  readonly STATUS = [
    { value: 'pending', label: 'Pendientes' },
    { value: 'completed', label: 'Completados' },
  ];

  readonly STATES = [
    { value: true, label: 'Con circular' },
    { value: false, label: 'Sin circular' },
  ];

  ngOnInit(): void {
    this.getData();
  }

  onPageChange({ rows = 10, page = 0 }: PaginatorState) {
    this.limit.set(rows);
    this.index.set(page);
    this.getData();
  }

  search(term: string) {
    this.term.set(term);
    this.index.set(0);
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(AsfiFundTransferDialogComponent, {
      header: 'Crear Solicitud',
      maximizable: true,
      modal: true,
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    ref.onClose.subscribe((item: any) => {
      if (!item) return;
      this.datasource.update((values) =>
        [item, ...values].slice(0, this.limit())
      );
      this.datasize.update((value) => (value += 1));
    });
  }

  update(item: AsfiFundTransfer) {
    const ref = this.dialogService.open(AsfiFundTransferDialogComponent, {
      header: 'Editar Solicitud',
      maximizable: true,
      modal: true,
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: item,
    });
    ref.onClose.subscribe((result: any | undefined) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex(({ id }) => id === result.id);
        if (index === -1) return values;
        values[index] = result;
        return [...values];
      });
      this.datasize.update((value) => (value += 1));
    });
  }

  showFile(item: AsfiFundTransfer) {
    this.selectedItem.set(item);
    this.isShowingFile.set(true);
  }

  onShowOptionsMenu(request: any): void {
    this.menuOptions.set([
      {
        label: 'Opciones',
        items: [
          {
            icon: 'pi pi-pencil',
            label: 'Editar solicitud',
            disabled: request.status !== 'pending',
            command: () => {
              this.update(request);
            },
          },
          {
            icon: 'pi pi-info-circle',
            label: 'Detalle solicitud',
            command: () => {
              // this.showDetail(request);
            },
          },
          {
            icon: 'pi pi-building-columns',
            label: 'Solicitar remision de fondos',
            disabled: !request.circularNumber,
            command: () => {
              // this.openAsfiFundTransferDialog(request);
            },
          },
        ],
      },
    ]);
  }

  filter() {
    this.index.set(0);
    this.popoverRef().hide();
    this.getData();
  }

  resetFilter() {
    this.filterForm.reset();
    this.filter();
  }



  get isFilterFormValid() {
    return Object.values(this.filterForm.value).some((value) => value !== null);
    // return Object.values(this.filterForm.value).some((value) => value !== null);
  }

  private getData() {
    this.requestService
      .findAll({
        limit: this.limit(),
        offset: this.offset(),
        term: this.term(),
        ...this.filterForm.value,
      })
      .subscribe((data) => {
        this.datasource.set(data.requests);
        this.datasize.set(data.length);
      });
  }
}

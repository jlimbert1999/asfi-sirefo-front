import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';

import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { SearchInputComponent } from '../../../../shared';
import { user } from '../../../infrastructure';
import { UserService } from '../../services';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-manage',
  imports: [
    CommonModule,
    TagModule,
    MenuModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    SearchInputComponent,
  ],
  templateUrl: './user-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserManageComponent {
  private userService = inject(UserService);
  readonly dialogService = inject(DialogService);

  datasource = signal<user[]>([]);
  datasize = signal(0);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  displayedColumns: string[] = ['login', 'fullname', 'status', 'options'];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.userService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ users, length }) => {
        this.datasource.set(users);
        this.datasize.set(length);
      });
  }

  create() {
    const dialogRef = this.dialogService.open(UserDialogComponent, {
      header: 'Crear Solicitud',
      modal: true,
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    dialogRef.onClose.subscribe((item: any) => {
      if (!item) return;
      this.datasource.update((values) =>
        [item, ...values].slice(0, this.limit())
      );
      this.datasize.update((value) => (value += 1));
    });
  }

  update(user: user) {
    const dialogRef = this.dialogService.open(UserDialogComponent, {
      header: 'Editar Solicitud',
      modal: true,
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: user,
    });
    dialogRef.onClose.subscribe((result: any | undefined) => {
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

  onPageChange({ rows = 10, page = 0 }: PaginatorState) {
    this.limit.set(rows);
    this.index.set(page);
    this.getData();
  }

  search(term: string) {
    this.index.set(0);
    this.term.set(term);
    this.getData();
  }
}

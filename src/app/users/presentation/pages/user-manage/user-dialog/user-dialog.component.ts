import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services';
import { user } from '../../../../infrastructure';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MultiSelectModule,
    CheckboxModule,
    PasswordModule,
    FloatLabelModule,
  ],
  templateUrl: './user-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(DynamicDialogRef);
  private detroyRef = inject(DestroyRef);

  data: user | undefined = inject(DynamicDialogConfig).data;

  hidePassword: boolean = true;

  formUser: FormGroup = this.formBuilder.group({
    fullName: ['', Validators.required],
    position: ['', Validators.required],
    login: ['', Validators.required],
    password: ['', Validators.required],
    roles: ['', Validators.required],
    active: [true, Validators.required],
  });
  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'employee', label: 'Funcionario' },
  ];

  ngOnInit(): void {
    this.listenChangesFullnameField();
    if (this.data) {
      this.formUser.patchValue(this.data);
      this.formUser.get('password')?.removeValidators([Validators.required]);
    }
  }

  save() {
    const subscription = this.data
      ? this.userService.update(this.data.id, this.formUser.value)
      : this.userService.create(this.formUser.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  close() {
    this.dialogRef.close();
  }

  private listenChangesFullnameField() {
    this.formUser
      .get('fullName')
      ?.valueChanges.pipe(takeUntilDestroyed(this.detroyRef))
      .subscribe((fullname) => {
        const login = this.generateLogin(fullname);
        this.formUser.get('login')?.setValue(login, { emitEvent: false }); // No dispares otro valueChange
      });
  }

  private generateLogin(fullname: string): string {
    if (!fullname) return '';

    const parts = fullname.trim().split(/\s+/);

    if (parts.length < 2) return '';

    const firstNameInitial = parts[0][0];
    const lastName = parts.length >= 3 ? parts[parts.length - 2] : parts[1];

    return (firstNameInitial + lastName).toUpperCase();
  }
}

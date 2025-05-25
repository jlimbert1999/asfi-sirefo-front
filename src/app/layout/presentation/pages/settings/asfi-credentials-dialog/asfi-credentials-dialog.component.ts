import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

import { Subject, switchMap, timer } from 'rxjs';

import { AsfiCredentialsService } from '../../../../../sirefo/presentation/services';
import { user } from '../../../../../users/infrastructure';
import {
  FieldValidationErrorMessages,
  FormErrorMessagesPipe,
} from '../../../../../shared';

@Component({
  selector: 'app-asfi-credentials-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ButtonModule,
    FormErrorMessagesPipe,
  ],
  template: `
    <div class="p-dialog-content">
      <form [formGroup]="form" class="mt-5">
        <div class="flex flex-col justify-center gap-y-8">
          <div class="flex items-center gap-x-6 mb-4">
            <div>
              <i class="pi pi-shield" style="font-size: 2.5rem"></i>
            </div>
            <div class=" font-bold text-lg">
              Ingrese el usuario y contraseña proporcionados por la ASFI para
              habilitar la comunicación con los servicios web del sistema
              (SIREFO)
            </div>
          </div>
          <div>
            <p-floatlabel>
              <input pInputText formControlName="asfiUsername" class="w-full" />
              <label>Usuario</label>
            </p-floatlabel>
            @if (form.get('asfiUsername')?.hasError &&
            form.get('asfiUsername')?.touched) {
            <p-message
              severity="error"
              variant="simple"
              size="small"
              styleClass="mt-2 px-2"
            >
              {{ form.get("asfiUsername")?.errors | formErrorMessages:errorMessages?.['asfiUsername'] }}
            </p-message>
            }
          </div>
          <div>
            <p-floatlabel class="w-full">
              <p-password
                formControlName="asfiPassword"
                [feedback]="false"
                [toggleMask]="true"
                autocomplete="off"
                inputStyleClass="w-full"
                styleClass="w-full"
              />
              <label>Contraseña</label>
            </p-floatlabel>
            @if (form.get('asfiPassword')?.hasError &&
            form.get('asfiPassword')?.touched) {
            <p-message
              severity="error"
              variant="simple"
              size="small"
              styleClass="mt-2 px-2"
            >
              {{ form.get("asfiPassword")?.errors | formErrorMessages:errorMessages?.['asfiPassword'] }}
            </p-message>
            }
          </div>
          @if (errorMessage()) {
          <p-message [life]="3000" severity="error">
            {{ errorMessage() }}
          </p-message>
          }

          <div class="text-md font-extralight">
            Sus credenciales serán almacenadas de forma segura y solo se
            utilizarán para la comunicación con ASFI.
          </div>
        </div>
      </form>
    </div>
    <div class="p-dialog-footer">
      <p-button
        label="Cancelar"
        severity="danger"
        variant="outlined"
        (onClick)="close()"
      />
      <p-button
        label="Guardar"
        [disabled]="!isSaveButtonEnabled()"
        (onClick)="save()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsfiCredentialsDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private asfiCredentialsService = inject(AsfiCredentialsService);
  private destroyRef = inject(DestroyRef);

  data: user | undefined = inject(DynamicDialogConfig).data;

  hidePassword: boolean = true;

  form: FormGroup = this.formBuilder.nonNullable.group({
    asfiUsername: ['', [Validators.required, Validators.email]],
    asfiPassword: ['', [Validators.required, Validators.minLength(4)]],
  });

  errorMessage = signal<string | null>(null);

  isSaveButtonEnabled = signal<boolean>(true);

  private messageTrigger$ = new Subject<void>();

  readonly errorMessages: FieldValidationErrorMessages = {
    asfiUsername: {
      email: 'Ingrese un correo electrónico válido',
    },
    asfiPassword: {
      required: 'La contraseña es requerida',
    },
  };

  ngOnInit(): void {
    this.messageTrigger$
      .pipe(
        switchMap(() => timer(3000)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.errorMessage.set(null);
        this.isSaveButtonEnabled.set(true);
      });
  }

  showMessage(message: string) {
    this.errorMessage.set(message);
    this.messageTrigger$.next();
  }

  save() {
    this.isSaveButtonEnabled.set(false);
    const { asfiUsername, asfiPassword } = this.form.value;
    this.asfiCredentialsService
      .validateCredentials(asfiUsername, asfiPassword)
      .pipe(
        switchMap(() =>
          this.asfiCredentialsService.setCredentials(asfiUsername, asfiPassword)
        )
      )
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage(
              error.status === 401
                ? 'Usuario o contraseña incorrectos'
                : 'No se pudo actualizar sus credenciales'
            );
          }
        },
      });
  }

  close() {
    this.dialogRef.close();
  }
}

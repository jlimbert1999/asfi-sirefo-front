import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

import { AsfiCredentialsDialogComponent } from './asfi-credentials-dialog/asfi-credentials-dialog.component';
import { AsfiCredentialsService } from '../../../../sirefo/presentation/services';
import { AuthService } from '../../../../auth/presentation/services/auth.service';
import {
  FormErrorMessagesPipe,
  FieldValidationErrorMessages,
} from '../../../../shared';
import { CustomFormValidators } from '../../../../helpers';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    MessageModule,
    FormErrorMessagesPipe,
  ],
  template: `
    <div class="mx-auto max-w-4xl py-4">
      <div class="px-4 sm:px-0">
        <h3 class="text-base/7 font-semibold">Configuracion del usuario</h3>
        <p class="mt-1 max-w-2xl text-md">Cambie su datos de acceso</p>
      </div>
      <div class="mt-6 border-t border-gray-200 mb-4">
        <form [formGroup]="formUser">
          <dl class="divide-y divide-gray-200">
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-md font-medium">Nombre</dt>
              <dd class="mt-1 text-md sm:col-span-2 sm:mt-0">
                {{ fullName | titlecase }}
              </dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-md font-medium">Contraseña</dt>
              <dd class="mt-1 sm:col-span-2 sm:mt-0 space-y-4 sm:max-w-[500px]">
                <div class="flex flex-col gap-y-8">
                  <div>
                    <p-floatlabel class="w-full sm:w-96">
                      <p-password
                        formControlName="password"
                        [feedback]="false"
                        [toggleMask]="true"
                        autocomplete="false"
                        inputStyleClass="w-full"
                        styleClass="w-full"
                      />
                      <label>Contraseña</label>
                    </p-floatlabel>
                    @if (formUser.get('password')?.hasError &&
                    formUser.get('password')?.touched) {
                    <p-message
                      severity="error"
                      variant="simple"
                      size="small"
                      styleClass="mt-2 px-2"
                    >
                      {{ formUser.get("password")?.errors | formErrorMessages:errorMessages?.['password'] }}
                    </p-message>
                    }
                  </div>
                  @if ( formUser.get("password")?.value){
                  <div>
                    <p-floatlabel class="w-full sm:w-96">
                      <p-password
                        formControlName="confirmPassword"
                        [feedback]="false"
                        [toggleMask]="true"
                        autocomplete="false"
                        inputStyleClass="w-full"
                        styleClass="w-full"
                      />
                      <label>Confirmar contraseña</label>
                    </p-floatlabel>
                    @if (formUser.get('confirmPassword')?.hasError &&
                    formUser.get('confirmPassword')?.touched) {
                    <p-message
                      severity="error"
                      variant="simple"
                      size="small"
                      styleClass="mt-2 px-2"
                    >
                      {{ formUser.get("confirmPassword")?.errors | formErrorMessages:errorMessages?.['confirmPassword'] }}
                    </p-message>
                    }
                  </div>
                  }
                </div>
              </dd>
            </div>

            @if(isEmployee){
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-md font-medium">Verficacion (ASFI)</dt>
              <dd class="mt-1 sm:col-span-2 sm:mt-0">
                @if(isVerified()){
                <p-button
                  label="Verificado"
                  [rounded]="true"
                  severity="success"
                  icon="pi pi-shield"
                  (onClick)="openAsfiCrendentials()"
                />
                } @else {
                <p-button
                  label="Verificar"
                  [rounded]="true"
                  severity="danger"
                  icon="pi pi-shield"
                  (onClick)="openAsfiCrendentials()"
                />
                }
              </dd>
            </div>
            }
          </dl>
        </form>
      </div>
      @if (visible()) {
      <div class="mb-6">
        <p-message [life]="3000" severity="success"
          >Cambios guardados</p-message
        >
      </div>
      }
      <p-button label="Guardar" [disabled]="formUser.invalid" (onClick)="save()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent implements OnInit {
  private dialogService = inject(DialogService);
  private authService = inject(AuthService);
  private asfiCredentialsService = inject(AsfiCredentialsService);
  private _formBuilder = inject(FormBuilder);

  isEmployee = this.authService.roles().includes('employee');
  isVerified = this.asfiCredentialsService.email;

  fullName = this.authService.user()?.fullName;
  formUser: FormGroup = this._formBuilder.nonNullable.group(
    {
      password: [
        '',
        [
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: CustomFormValidators.matchFields(
        'password',
        'confirmPassword'
      ),
    }
  );

  visible = signal(false);

  protected errorMessages: FieldValidationErrorMessages = {
    password: {
      pattern:
        'Ingrese al menos una letra minúscula, una mayúscula y un número',
    },
    confirmPassword: {
      not_match: 'Las contraseñas no coinciden',
    },
  };

  ngOnInit(): void {
    this.checkVefification();
  }

  save() {
    const { password } = this.formUser.value;
    this.authService.updateMyUser(password).subscribe(() => {
      this.showMessage();
    });
  }
  openAsfiCrendentials() {
    this.dialogService.open(AsfiCredentialsDialogComponent, {
      header: 'Verificar Credenciales',
      modal: true,
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
  }

  checkVefification() {
    if (!this.isEmployee) return;
    if (!this.isVerified()) {
      this.openAsfiCrendentials();
    }
  }

  showMessage() {
    this.visible.set(true);
    setTimeout(() => {
      this.visible.set(false);
    }, 3300);
  }
}

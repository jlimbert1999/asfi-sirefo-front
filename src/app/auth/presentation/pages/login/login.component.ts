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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    FloatLabelModule,
    CheckboxModule,
    MessageModule,
  ],
  template: `
    <div class="flex flex-col h-screen">
      <div class="flex-1 flex items-center justify-center w-full h-full">
        <div
          class="flex flex-col bg-white rounded-xl shadow-lg p-8 animate-fadeinup animate-duration-500 w-11/12 sm:w-[450px]"
        >
          <div class="sm:mx-auto mb-4">
            <img
              class="mx-auto size-20"
              src="images/icons/app-icon.png"
              alt="Icon app"
            />
          </div>
          <div class="font-bold text-xl text-center mb-6">
            Sistema de Gestión de Retenciones, Suspensiones y Remision de Fondos
          </div>
          <div class="sm:mx-auto mb-6">
            <p class="text-center text-xl font-bold tracking-wide">
              Inicio de Sesion
            </p>
            <p class="text-center">
              Ingrese sus datos proporcinados por el Jefatura de Gobierno
              Electronico
            </p>
          </div>
          <form [formGroup]="loginForm" autocomplete="off" (ngSubmit)="login()">
            <div class="flex justify-center">
              <div class="w-full flex flex-col gap-y-8">
                <div>
                  <p-floatlabel>
                    <input
                      pInputText
                      autocomplete="off"
                      class="w-full"
                      formControlName="login"
                    />
                    <label>Usuario</label>
                  </p-floatlabel>
                </div>
                <div>
                  <p-floatlabel class="w-full">
                    <p-password
                      [feedback]="false"
                      [toggleMask]="true"
                      autocomplete="false"
                      inputStyleClass="w-full"
                      styleClass="w-full"
                      formControlName="password"
                    />
                    <label>Contraseña</label>
                  </p-floatlabel>
                </div>
                <div>
                  <p-checkbox
                    #stateCheck
                    [binary]="true"
                    formControlName="remember"
                  />
                  <label class="ml-2"> Recordar nombre de usuario </label>
                </div>

                <p-button
                  type="submit"
                  label="Ingresar"
                  [loading]="isLoading()"
                  [disabled]="loginForm.invalid"
                  styleClass="w-full"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="mx-auto w-full px-4 py-3">
        <div class="flex items-center gap-x-4">
          <div>
            <img
              src="images/logos/gams.png"
              class="w-8 sm:w-12"
              alt="Institution icon"
            />
          </div>
          <div>
            <p class="text-md text-gray-600 max-md:text-center">
              2025 - Gobierno Autonomo Municipal de Sacaba
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  message = signal<string | null>(null);

  loginForm: FormGroup = this._formBuilder.group({
    login: ['', [Validators.required]],
    password: ['', Validators.required],
    remember: [false],
  });

  ngOnInit(): void {
    const loginSaved = localStorage.getItem('login');
    if (!loginSaved) return;
    this.loginForm.patchValue({ login: loginSaved, remember: true });
  }

  login() {
    this.isLoading.set(true);
    const { login, password, remember } = this.loginForm.value;
    this.authService
      .login(login, password, remember)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe(() => {
        this.router.navigateByUrl('');
      });
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../auth/presentation/services/auth.service';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  template: `
    <div
      class="flex flex-col items-center justify-center h-[calc(100vh-128px)] px-2"
    >
      <img
        alt="Logo"
        src="images/icons/home.png"
        class="h-32 sm:h-48 mb-6 opacity-50"
      />
      <h1 class="text-xl sm:text-3xl font-bold tracking-wide text-center">
        ¡Bienvenid&#64; {{ userName ?? 'Usuario' | titlecase }}!
      </h1>
      <p class="text-gray-600 mt-2 italic">
        "Gestiona solicitudes de retención, suspensión y remisión de fondos"
      </p>
      <p class="text-sm mt-8">Versión 1.0.0</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingComponent {
  userName = inject(AuthService).user()?.fullName.split(' ')[0].toUpperCase();
}

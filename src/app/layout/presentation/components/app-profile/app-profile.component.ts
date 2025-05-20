import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Popover, PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/presentation/services/auth.service';
@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ButtonModule,
    PopoverModule,
    MenuModule,
    AvatarModule,
  ],
  template: `
    <button
      type="button"
      class="layout-topbar-action"
      (click)="op.toggle($event)"
    >
      <i class="pi pi-user"></i>
      <span>Profile</span>
    </button>

    <p-popover #op>
      <div class="w-11/12 sm:w-[25rem]">
        <div class="flex flex-col gap-y-2 items-center pb-4">
          <p-avatar
            [label]="profileLetter"
            styleClass="mr-2"
            size="xlarge"
            shape="circle"
          />
          <span class="text-lg font-bold leading-8">
            {{ user?.fullName | titlecase }}
          </span>
          <span class="text-sm font-bold leading-8">
            {{ user?.jobtitle | uppercase }}
          </span>
        </div>
      </div>
      <p-menu [model]="items" />
    </p-popover>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProfileComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private menu = viewChild<Popover>('op');

  profileLetter = this.authService.profileLetter();
  user = this.authService.user();
  items: MenuItem[] = [
    {
      label: 'Opciones',
      items: [
        {
          label: 'Configuraciones',
          icon: 'pi pi-cog',
          command: () => {
            this.router.navigateByUrl('/settings');
            this.menu()?.hide();
          },
        },
        {
          label: 'Cerrar sesion',
          icon: 'pi pi-sign-out',
          command: () => {
            this.authService.logout();
            this.router.navigateByUrl('/login');
            this.menu()?.hide();
          },
        },
      ],
    },
  ];
}

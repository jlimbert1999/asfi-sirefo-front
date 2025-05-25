import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/presentation/pages/dashboard/dashboard.component';
import {
  isAuthenticatedGuard,
  isNotAuthenticatedGuard,
} from './auth/presentation/guards';
import { checkAsfiCredentialsGuard } from './sirefo/presentation/guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [isNotAuthenticatedGuard],
    title: 'Inicio de sesion',
    loadComponent: () =>
      import('./auth/presentation/pages/login/login.component'),
  },
  {
    title: 'Inicio',
    path: '',
    canActivate: [isAuthenticatedGuard],
    component: DashboardComponent,
    children: [
      {
        path: '',
        canActivate: [checkAsfiCredentialsGuard],
        loadComponent: () =>
          import('./layout/presentation/pages/landing/landing.component'),
      },
      {
        title: 'Configuraciones',
        path: 'settings',
        loadComponent: () =>
          import('./layout/presentation/pages/settings/settings.component'),
      },
      {
        path: 'admin',
        children: [
          {
            title: 'Usuarios',
            path: 'users',
            loadComponent: () =>
              import(
                './users/presentation/pages/user-manage/user-manage.component'
              ),
          },
        ],
      },
      {
        path: 'home',
        canActivateChild: [checkAsfiCredentialsGuard],
        children: [
          {
            path: 'methods',
            loadComponent: () =>
              import('./sirefo/presentation/pages/methods/methods.component'),
          },
          {
            path: 'entities',
            loadComponent: () =>
              import('./sirefo/presentation/pages/entities/entities.component'),
          },
          {
            path: 'asfi-request',
            loadComponent: () =>
              import(
                './sirefo/presentation/pages/asfi-request/asfi-request.component'
              ),
          },
          {
            path: 'asfi-fund-transfer',
            loadComponent: () =>
              import(
                './sirefo/presentation/pages/asfi-fund-tranfer/asfi-fund-tranfer.component'
              ),
          },
          {
            path: 'request-list',
            loadComponent: () =>
              import(
                './sirefo/presentation/pages/request-list/request-list.component'
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

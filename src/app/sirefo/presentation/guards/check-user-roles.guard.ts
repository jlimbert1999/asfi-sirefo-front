import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { tap } from 'rxjs';

import { AuthService } from '../../../auth/presentation/services/auth.service';
import { AsfiCredentialsService } from '../services';

export const checkUserRolesGuard: CanActivateFn = () => {
  const roles = inject(AuthService).roles();
  if (!roles.includes('employee')) return true;
  const router = inject(Router);
  return inject(AsfiCredentialsService)
    .checkCredentials()
    .pipe(
      tap((isValid) => {
        if (!isValid) {
          router.navigateByUrl('/settings');
        }
      })
    );
};

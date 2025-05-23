import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { LoaderService, ToastService } from '../../shared';

export const UPLOAD_INDICATOR = new HttpContextToken<boolean>(() => true);
export const LOAD_INDICATOR = new HttpContextToken<boolean>(() => true);

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const toastService = inject(ToastService);
  const loaderService = inject(LoaderService);
  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });

  const showUploadIndicator =
    req.context.get(UPLOAD_INDICATOR) && req.method !== 'GET';
  const showLoadIndicator =
    req.context.get(LOAD_INDICATOR) && req.method === 'GET';

  if (showLoadIndicator) {
    loaderService.toggleLoading(true);
  }

  if (showUploadIndicator) {
    loaderService.toggleUploading(true);
  }

  return next(reqWithHeader).pipe(
    catchError((error) => {
      console.log(error);
      handleHttpErrorMessages(error, toastService);
      return throwError(() => error);
    }),
    finalize(() => {
      if (showUploadIndicator) loaderService.toggleUploading(false);
      if (showLoadIndicator) loaderService.toggleLoading(false);
    })
  );
}

const handleHttpErrorMessages = (
  error: HttpErrorResponse,
  service: ToastService
) => {
  const description: string =
    typeof error.error['message'] === 'string'
      ? error.error['message']
      : 'Solicitud incorrecta';

  switch (error.status) {
    case 500:
      service.show({
        severity: 'error',
        title: 'Error interno',
        description: 'No se puedo procesar su solicitud',
      });
      break;
    case 401:
      // authService.logout();
      // router.navigate(['/login']);
      break;
    case 400:
      service.show({
        severity: 'warn',
        title: 'Solictud incorrecta',
        description,
      });
      break;
    case 403:
      // Alert.Alert({
      //   icon: 'info',
      //   title: 'Accesso denegado',
      //   text: 'Esta cuenta no tiene los permisos requeridos',
      // });
      break;
    case 404:
      service.show({
        severity: 'warn',
        title: 'Solictud incorrecta',
        description,
      });
      break;
    default:
      break;
  }
  throw error;
};

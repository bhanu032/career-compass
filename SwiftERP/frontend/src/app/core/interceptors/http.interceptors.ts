import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const token = auth.token;

  let authReq = req;
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh-token')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        return auth.refreshToken().pipe(
          switchMap(res => {
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.data.accessToken}`
              },
              withCredentials: true
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            auth.logout();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred.';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
        if (error.error.errors && error.error.errors.length > 0) {
          errorMessage += ': ' + error.error.errors.join(', ');
        }
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your backend connection.';
      }

      if (error.status !== 401) {
        toast.error('Request Failed', errorMessage);
      }

      return throwError(() => error);
    })
  );
};

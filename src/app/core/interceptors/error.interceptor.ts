import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { NotificationService } from '../services/notification.service';

const userMessage = (error: HttpErrorResponse): string => {
  if (error.status === 0) return 'The service is unavailable. Check your connection and try again.';
  if (error.status === 400) return 'The request could not be processed. Please review the supplied information.';
  if (error.status === 401) return 'Your session has expired. Please sign in again.';
  if (error.status === 403) return 'You do not have permission to perform this action.';
  if (error.status === 404) return 'The requested resource could not be found.';
  if (error.status >= 500) return 'The service encountered an error. Please try again later.';
  return 'Something went wrong while processing the request.';
};

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const notifications = inject(NotificationService);
  const router = inject(Router);
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes('/auth/login')) {
        auth.clearSession();
        void router.navigate(['/login']);
      }
      notifications.error(userMessage(error));
      return throwError(() => error);
    }),
  );
};

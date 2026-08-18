import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const enriched = request.clone({
    setHeaders: {
      'X-Client-Application': 'WBSSOT-SIBRADADMIN',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  return next(enriched);
};

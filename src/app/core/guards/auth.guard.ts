// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../auth/services/auth.service';

// export const authGuard: CanActivateFn = (_route, state) => {
//   const auth = inject(AuthService);
//   const router = inject(Router);
//   return auth.isAuthenticated() ? true : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
// };

// export const roleGuard: CanActivateFn = (route) => {
//   const auth = inject(AuthService);
//   const router = inject(Router);
//   const roles = (route.data?.['roles'] as string[] | undefined) ?? [];
//   return auth.hasRole(roles) ? true : router.createUrlTree(['/dashboard']);
// };



import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data?.['roles'] as string[] | undefined) ?? [];
  return auth.hasRole(roles) ? true : router.createUrlTree(['/dashboard']);
};

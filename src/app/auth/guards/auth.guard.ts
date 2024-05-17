import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

function checkAuthStatus(): Observable<boolean> | boolean {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuth().pipe(
    // tap((isautheticated) => console.log(isautheticated)),
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
      }
    }),
  );
};

export const authCanMatchGuard: CanMatchFn =
  (route: Route, segments: UrlSegment[]) => checkAuthStatus();

export const authCanActivateGuard: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => checkAuthStatus();


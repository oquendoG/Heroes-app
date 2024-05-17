import { map, Observable, tap } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { inject } from "@angular/core";

function checkAuthStatus(): Observable<boolean> | boolean {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuth().pipe(
    // tap((isautheticated) => console.log(isautheticated)),
    tap((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigate(['./']);
      }
    }),
    map(isUthenticated => !isUthenticated)
  );
}

export const publicCanActivateGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => checkAuthStatus();


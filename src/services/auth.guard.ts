import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { KEY_STORE, ROUTE_LINK } from 'src/helper/constants';


export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const cookieService: CookieService = inject(CookieService);
  const router: Router = inject(Router);
  const token = cookieService.get(KEY_STORE.TOKEN);
  return token
    ? true
    : router.navigate(['/'+ ROUTE_LINK.LOGIN]);
};

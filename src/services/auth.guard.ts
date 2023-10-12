import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { KEY_STORE, ROLE, ROUTE_LINK } from 'src/helper/constants';
import { StorageService } from './storage.service';


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
export const SAminRole: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const storageService: StorageService = inject(StorageService);
  const router: Router = inject(Router);
  const role = storageService.getItem(KEY_STORE.USER_ROLE);
  return role == ROLE.S_ADMIN
    ? true
    : router.navigate(['/'+ ROUTE_LINK.LOGIN]);
};

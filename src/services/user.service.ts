import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { APIResponseModel, LoginModel, UserModel } from 'src/models/model';
import { Constants, KEY_STORE, ROLE } from 'src/helper/constants';
import { StorageService } from './storage.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  private userSubject: BehaviorSubject<UserModel>;
  public user: Observable<UserModel>;
  constructor(
    http: HttpClient,
    private storageService: StorageService,
    cookieService: CookieService
  ) {
    super(http, cookieService);
    const user = JSON.parse(
      this.storageService.getItem(KEY_STORE.USER_STORE) || 'null'
    );
    this.userSubject = new BehaviorSubject<UserModel>(user);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): UserModel {
    return this.userSubject.value;
  }

  login(
    username: string,
    password: string
  ): Observable<APIResponseModel<string>> {
    const apiUrl = Constants.API_URL + 'UserLogin/login';
    const body = {
      userName: username,
      password: password,
    };
    return this.doPost(apiUrl, JSON.stringify(body), '').pipe(
      map((res) => {
        if (res.status && res.statusCode === 200) {
          const data = new LoginModel().deserialize(res.data);
          if (data.role == ROLE.ADMIN || data.role == ROLE.S_ADMIN) {
            this.storageService.setItem(
              KEY_STORE.USER_STORE,
              JSON.stringify(data.data)
            );
            this.userSubject.next(data.data);
          }

        }
        return res;
      })
    );
  }
  logout() {
    this.storageService.removeItem(KEY_STORE.USER_STORE);
    this.cookieService.delete(KEY_STORE.TOKEN);
    this.userSubject.next(
      JSON.parse(this.storageService.getItem(KEY_STORE.USER_STORE) || 'null')
    );
  }
}

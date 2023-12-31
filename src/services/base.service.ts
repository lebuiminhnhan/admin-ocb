import { Injectable, Injector, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { KEY_STORE, ROUTE_LINK } from 'src/helper/constants';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class BaseService implements OnInit {
  static injector: Injector;
  protected _http: HttpClient | undefined;
  protected tokenKey!: string;
  cookieService: CookieService = inject(CookieService);
  storageService: StorageService = inject(StorageService);
  router: Router = inject(Router);
  constructor(public http: HttpClient) {
    if (BaseService.injector) {
      this._http = http;
    }
  }

  ngOnInit() {
  }

  protected doGet(apiUrl: string, params?: string, type = ""): Observable<any> {
    let header: HttpHeaders;
    header = this.createHeader(type);

    return this.http.get(apiUrl, {headers: header}).pipe(
      map((response) => {
        return response;
      }),
      catchError(err => {
        this.handleError(err);
        return throwError(err);
      }));
  }

  protected doDelete(apiUrl: string, params?: string): Observable<any> {
    let header: HttpHeaders;
    header = this.createHeader('');

    const url = (params === undefined) ? `${apiUrl}` : `${apiUrl}/${params}`;
    return this.http.delete(url, { headers: header }).pipe(
      map((response) => {
        return response;
      }),
      catchError(err => {
        this.handleError(err);
        return throwError(err);
      }));
  }

  protected doPost(apiUrl: string, data?: any, type = ""): Observable<any> {
    const bodyString = JSON.stringify(data);

    let header: HttpHeaders;
    header = this.createHeader(type);

    if (type === 'json') {
      data = bodyString;
    }

    return this.http.post(`${apiUrl}`, data, {headers: header}).pipe(
      map((response: any) => {
        return this.doResponse(response);
      }),
      catchError((err) => {
        this.handleError(err);
        return throwError(err);
      })
    );
  }

  protected doPut(apiUrl: string, data: any, type = ""): Observable<any> {
    const bodyString = JSON.stringify(data);
    let header: HttpHeaders;
    header = this.createHeader(type);

    if (type === 'json') {
      data = bodyString;
    }

    return this.http.put(`${apiUrl}`, data, {headers: header}).pipe(
      map((response: any) => {
        return this.doResponse(response);
      }),
      catchError(err => {
        this.handleError(err);
        return throwError(err);
      }));
  }

  private doResponse(response: { status: any; statusCode: any; } | undefined) {
    if (response !== undefined) {
      if (response.status === "FAILD") {

      }
    }
    return response;
  }

  private createHeader(type: string) {
    let contentType = '';
    const headerOption: any = {
      'Cache-control': 'no-cache',
      'Pragma': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Accept': '*/*'
    };

    switch (type) {
      case '':
      case 'notUseAuth':
      case 'json':
        contentType = 'application/json';
        break;
      case 'text':
        contentType = 'text/plain';
        break;
      case 'authentication':
        contentType = 'application/x-www-form-urlencoded';
        break;
      case 'empty':
        contentType = '';
        break;
      case 'file':
        contentType = 'multipart/form-data;boundary {}';
        break;
      case 'empty':
        contentType = '';
        break;
      default:
        contentType = 'application/json';
        break;
    }

    if (contentType.length > 0) {
      headerOption['Content-Type'] = contentType;
    }

    if (this.cookieService.get(KEY_STORE.TOKEN)) {
      headerOption['Authorization'] = "Bearer "+this.cookieService.get(KEY_STORE.TOKEN);
    }

    let headers = new HttpHeaders(headerOption);
    return headers;
  }
  private handleError(error: any) {
    console.log(error);
    switch (error.status) {
      case 401:
        this.storageService.removeItem(KEY_STORE.USER_STORE);
        this.cookieService.delete(KEY_STORE.TOKEN);
        this.router.navigate(['/', ROUTE_LINK.LOGIN]);
        break;

      default:
        break;
    }
  }

  public alertMessage(message: string) {
    Swal.fire({
      title: 'Thông báo',
      text: message,
      timer: 2000,
      timerProgressBar: true,
    })
  }
}

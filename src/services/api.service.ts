import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BaseService } from './base.service';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { APIResponseModel, ContactModel, GiftModel } from 'src/models/model';
import { Constants } from 'src/helper/constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService  extends BaseService {
  constructor(
    http: HttpClient,
    private storageService: StorageService,
    cookieService: CookieService
  ) {
    super(http, cookieService);
  }

  // Gift

  getGiftList(): Observable<APIResponseModel<GiftModel[]>> {
    const apiUrl = Constants.API_URL + 'Gift';
    return this.doGet(apiUrl);
  }

  getGiftById(id: number): Observable<APIResponseModel<GiftModel>> {
    const apiUrl = Constants.API_URL + 'Gift/' + id;
    return this.doGet(apiUrl);
  }

  createGift(gift: GiftModel): Observable<APIResponseModel<GiftModel>> {
    const apiUrl = Constants.API_URL + 'Gift';
    let data = gift;
    delete data.id;
    const body = JSON.stringify(gift);
    return this.doPost(apiUrl, body);
  }

  updateGift(id: number, gift: GiftModel): Observable<APIResponseModel<GiftModel>> {
    const apiUrl = Constants.API_URL + 'Gift/' + id;
    const body = JSON.stringify(gift);
    return this.doPut(apiUrl, body);
  }

  deleteGift(id: number): Observable<APIResponseModel<string>> {
    const apiUrl = Constants.API_URL + 'Gift/' + id;
    return this.doDelete(apiUrl);
  }

  // footer

  registerInfo(email: string): Observable<APIResponseModel<string>> {
    const apiUrl = Constants.API_URL + 'UserLogin/register-info';
    const body  = { email };
    return this.doPost(apiUrl, JSON.stringify(body),'');
  }

  // contact

  contactInfo(contacts: ContactModel): Observable<APIResponseModel<string>> {
    const apiUrl = Constants.API_URL + 'UserLogin/contact-info';
    return this.doPost(apiUrl, JSON.stringify(contacts),'');
  }


}

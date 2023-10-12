import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable, map } from 'rxjs';
import { APIResponseModel, GiftModel, InfoContactModel, InfoRegisterModel, UserModel, UserSystemModel } from 'src/models/model';
import { Constants, KEY_STORE } from 'src/helper/constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService  extends BaseService {
  constructor(
    http: HttpClient
  ) {
    super(http);
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
    const body = new FormData();
    body.append('Name', data.name);
    body.append('DateTo', this.convertDate(data.dateTo));
    body.append('DateFrom', this.convertDate(data.dateFrom));
    body.append('Value', data.value + '');
    body.append('IsHot', data.isHot + '');
    body.append('Description', data.description + '');
    body.append('file', data.image, data.image?.name);
    //return this.doPost(apiUrl, body, 'file');
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.cookieService.get(KEY_STORE.TOKEN)
      })
    };

    return this.http.post(apiUrl, body, options).pipe(
      map((response: any) => {
        return response;
      }));
    }

    getImageById(id: number): Observable<APIResponseModel<any>> {
      const apiUrl = Constants.API_URL + `Gift/${id}/image`;
      return this.doGet(apiUrl);
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

  // contact

  getInfoContactList(): Observable<APIResponseModel<InfoContactModel[]>> {
    const apiUrl = Constants.API_URL + 'InfoContact';
    return this.doGet(apiUrl);
  }

  exportExel() {
    const apiUrl = Constants.API_URL + 'InfoContact/export-excel';
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.cookieService.get(KEY_STORE.TOKEN)
      })
    };
    return this.http.get(apiUrl, {headers: options.headers, responseType: 'arraybuffer'});
  }

  deleteInfoContact(id: number): Observable<APIResponseModel<string>> {
    const apiUrl = Constants.API_URL + 'InfoContact/' + id;
    return this.doDelete(apiUrl);
  }

  // Info Register


  getInfoRegisterList(): Observable<APIResponseModel<InfoRegisterModel[]>> {
    const apiUrl = Constants.API_URL + 'InfoRegister';
    return this.doGet(apiUrl);
  }

  deleteInfoRegister(id: number): Observable<APIResponseModel<string>> {
    const apiUrl = Constants.API_URL + 'InfoRegister/'+ id;
    return this.doDelete(apiUrl);
  }

  exportToExcelInfoRegister() {
    const apiUrl = Constants.API_URL + 'InfoRegister/export-excel';
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.cookieService.get(KEY_STORE.TOKEN)
      })
    };
    return this.http.get(apiUrl, {headers: options.headers, responseType: 'arraybuffer'});
  }


  // User

  getUserList(): Observable<APIResponseModel<UserModel[]>> {
    const apiUrl = Constants.API_URL + 'User';
    return this.doGet(apiUrl);
  }
  createUser(user: UserModel): Observable<APIResponseModel<UserModel>> {
    const apiUrl = Constants.API_URL + 'User';
    let data = user;
    delete data.id;
    return this.doPost(apiUrl, JSON.stringify(data));
  }
  updateUser(id: number, user: UserModel): Observable<APIResponseModel<UserModel>> {
    const apiUrl = Constants.API_URL + 'User/' + id;
    return this.doPut(apiUrl, JSON.stringify(user));
  }
  deleteUser(id: number): Observable<APIResponseModel<string>> {
    const apiUrl = Constants.API_URL + 'User/' + id;
    return this.doDelete(apiUrl);
  }


  // User system

  getUserSystemList(): Observable<APIResponseModel<UserSystemModel[]>> {
    const apiUrl = Constants.API_URL + 'UserSystem';
    return this.doGet(apiUrl);
  }
  createUserSystem(user: UserSystemModel): Observable<APIResponseModel<UserSystemModel>> {
    const apiUrl = Constants.API_URL + 'UserSystem';
    let data = user;
    delete data.id;
    delete data.user;
    return this.doPost(apiUrl, JSON.stringify(data));
  }
  updateUserSystem(id: number, user: UserSystemModel): Observable<APIResponseModel<UserSystemModel>> {
    const apiUrl = Constants.API_URL + 'UserSystem/' + id;
    return this.doPut(apiUrl, JSON.stringify(user));
  }
  deleteUserSystem(id: number): Observable<APIResponseModel<string>> {
    const apiUrl = Constants.API_URL + 'UserSystem/' + id;
    return this.doDelete(apiUrl);
  }


  convertDate(date: any): string {
    if (!date) {
      return '--';
    }
    const today = new Date(date);
    let formattedToday = "";
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1 + ""; // Months start at 0!
    let dd = today.getDate() + "";
    let tt = (today.getHours() >= 10 ? today.getHours() : "0" + today.getHours()) + ":" + (today.getMinutes() >= 10 ? today.getMinutes() : "0" + today.getMinutes());
    if (Number(dd) < 10) dd = '0' + dd;
    if (Number(mm) < 10) mm = '0' + mm;
    return formattedToday = mm + '/' + dd + '/' + yyyy + ' ' + tt;
  }

}

export class Constants {
  public static API_URL = 'https://localhost:7097/api/';
}

export enum KEY_STORE {
  USER_STORE = 'user-store',
  USER_ROLE = 'user-role',
  TOKEN = 'token',
  CALL_LOGIN= 'call-login',
  CALL_RELOAD_LIST = 'call-reload-list'
}

export enum ROUTE_LINK {
  HOME = '',
  LOGIN = 'dang-nhap',
  USER_SYSTEM = 'nguoi-dung-noi-bo',
  USER ='khach-hang',
  GIFT = 'qua-tang',
  INFO_CONTACT = 'thong-tin-lien-he',
  INFO_REGISTER = 'thong-tin-dang-ki'
}

export enum ROLE {
  ADMIN = 'Admin',
  S_ADMIN = 'S_Admin',
}

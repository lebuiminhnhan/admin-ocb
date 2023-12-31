export interface Deserializable {
  deserialize(input: any): this;
}
export class GiftModel implements Deserializable {
  name: string = 'Thẻ viettel 10.000đ';
  image: any;
  id: any;
  value: number = 100;
  isHot: boolean = false;
  dateTo:string = "";
  dateFrom: string = "";
  description: string = 'Description';
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
export class InfoContactModel implements Deserializable {
  id: any;
  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
export class InfoRegisterModel implements Deserializable {
  id: any;
  email: string = '';
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
export class UserModel implements Deserializable {
  id: any;
  name: string = "";
  dateOfBirth: string = "";
  phoneNumber: string = "";
  email: string = "";
  address: string = "";
  pointValue: number = 1000;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}


export class UserSystemModel implements Deserializable {
  user?: UserModel = new UserModel();
  id: any;
  userId: any;
  userName: string = "";
  password: string = "";
  roleUser: string = "";
  deserialize(input: any) {
    input.user = new UserModel().deserialize(input.user);
    Object.assign(this, input);
    return this;
  }
}
export class LoginModel implements Deserializable {
  data: UserModel = new UserModel();
  token: string = "";
  role: string = "";
  deserialize(input: any) {
    input.dataUser = new UserModel().deserialize(input.data);
    Object.assign(this, input);
    return this;
  }
}


export class APIResponseModel<T> {
   status: string = "OK";
   message: string = "";
   statusCode: number = 200;
   data!: T;
}

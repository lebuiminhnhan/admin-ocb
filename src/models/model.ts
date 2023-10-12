export interface Deserializable {
  deserialize(input: any): this;
}
export class GiftModel implements Deserializable {
  name: string = 'Thẻ viettel 10.000đ';
  image: string = 'assets/img/viettel.png';
  id?: number = 1;
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
export class UserModel implements Deserializable {
  id: number = 0;
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
export class ContactModel implements Deserializable {
  name: string = "";
  email: string = "";
  subject: string = "";
  message: string = "";
  deserialize(input: any) {
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

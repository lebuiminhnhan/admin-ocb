import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KEY_STORE, ROUTE_LINK } from 'src/helper/constants';
import { UserModel } from 'src/models/model';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  year = new Date().getFullYear();
  user: UserModel = new UserModel();
  route_link = ROUTE_LINK;
  constructor(private userService: UserService, private router: Router, private storageService: StorageService) {
    this.userService.user.subscribe((x) => (this.user = x));
  }


  get isLogin() {
    return !this.userService.userValue;
  }

  get role() {
    return this.storageService.getItem(KEY_STORE.USER_ROLE);
  }

  get activePage() {
    return location.pathname.replace('/', '') || '';
  }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/' + ROUTE_LINK.LOGIN]);
  }

  titlePage() {
    switch (this.activePage) {
      case ROUTE_LINK.USER:
        return "Quản lý khách hàng";
      case ROUTE_LINK.USER_SYSTEM:
        return "Quản lý người dùng hệ thống";
      case ROUTE_LINK.GIFT:
        return "Quản lý quà tặng";
      case ROUTE_LINK.INFO_CONTACT:
        return "Quản lý liên hệ";
      case ROUTE_LINK.INFO_REGISTER:
        return "Quản lý nhận thông tin";

      default:
        return "Quản lý khách hàng";
    }
  }

}

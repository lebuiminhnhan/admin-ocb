import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { finalize } from 'rxjs';
import { KEY_STORE, ROLE } from 'src/helper/constants';
import { LoginModel } from 'src/models/model';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password!: string;
  userName!: string;
  message!: string;
  messageForgot!: string;
  isShowError = false;
  isLoading = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
  }

  login() {
    this.isLoading = true;
    this.userService.login(this.userName, this.password)
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe(
      (res) => {
        if (res.status && res.statusCode === 200) {
          const data = new LoginModel().deserialize(res.data);
          if (data.role == ROLE.ADMIN || data.role == ROLE.S_ADMIN) {
            this.cookieService.set(KEY_STORE.TOKEN, data.token);
            this.storageService.setItem(KEY_STORE.USER_STORE, JSON.stringify(data.data));
            this.storageService.setItem(KEY_STORE.USER_ROLE, data.role);
            this.router.navigate(['']);
          } else {
            this.message = 'Bạn không có quyền truy cập';
            this.isShowError = true;
          }
        } else {
          this.isShowError = true;
          this.message = res.message;
        }
      }
    );
  }

}

import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
import { ROLE } from 'src/helper/constants';
import { UserModel, UserSystemModel } from 'src/models/model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-user-system',
  templateUrl: './user-system.component.html',
  styleUrls: ['./user-system.component.css']
})
export class UserSystemComponent implements OnInit {

  title: string = '';
  UserSystemList: UserSystemModel[] = [];
  ColumnMode = ColumnMode;
  isLoading = false;
  isEditable = false;
  UserSystemItem!: UserSystemModel;
  imgShow: any;
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Tên đăng nhập', prop: 'userName' },
    { name: 'Quyền', prop: 'roleUser' },
  ];
  bsModalRef?: BsModalRef;
  modalRef?: BsModalRef;
  UserSystemForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    userName: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    userId: new FormControl(0, [Validators.required]),
    roleUser: new FormControl('', [Validators.required]),
    user: new FormControl('')
  });
  roleList = [ROLE.ADMIN, ROLE.USER];
  UserList: UserModel[] = [];
  userActiveId = 0;
  constructor(
    private apiService: ApiService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getUserSystemList();
    this.getUserList();
  }
  get formUserSystem() {
    return this.UserSystemForm;
  }

  onUserChange(event: any) {
    this.formUserSystem.controls['user'].setValue(this.UserList.find(x => x.id == event.target.value));
  }
  onRoleChange(event: any) {
    this.formUserSystem.controls['roleUser'].setValue(event.target.value);
  }

  getUserList() {
    this.isLoading = true;
    this.apiService
      .getUserList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        if (response.status && response.statusCode === 200) {
          this.UserList = response.data
            .map((User) => new UserModel().deserialize(User))
            .reverse();
        }
      });
  }

  openModal(template: TemplateRef<any>, isEdit = false) {
    this.title = isEdit ? 'Sửa thông tin & phân quyền người dùng' : 'Thêm người dùng';
    const initialState: ModalOptions = {
      initialState: {},
      animated: true,
      ignoreBackdropClick: true,
      class: 'modal-lg',
    };
    this.bsModalRef = this.modalService.show(template, initialState);
  }
  getUserSystemList() {
    this.isLoading = true;
    this.apiService
      .getUserSystemList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        if (response.status && response.statusCode === 200) {
          this.UserSystemList = response.data
            .map((UserSystem) => new UserSystemModel().deserialize(UserSystem))
            .reverse();
        }
      });
  }
  createUserSystem() {
    this.isLoading = true;
    this.apiService
      .createUserSystem(this.UserSystemForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (res.status && res.statusCode === 200) {
          this.modalService.hide();
          this.getUserSystemList();
          this.onClosePopup();
        }
        alert(res.message);
      });
  }

  updateUserSystem() {
    this.isLoading = true;
    this.apiService
      .updateUserSystem(this.UserSystemItem.id || 0, this.UserSystemForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (res) {
          this.modalService.hide();
          this.getUserSystemList();
          this.onClosePopup();
        }
        alert(res.message);
      });
  }

  onClosePopup() {
    this.UserSystemForm.reset();
    this.UserSystemItem = new UserSystemModel();
    this.isEditable = false;
    this.imgShow = null;
  }

  editModal(item: UserSystemModel, template: TemplateRef<any>) {
    console.log(item);

    this.UserSystemItem = item;
    this.UserSystemForm.controls['userId'].setValue(item.userId);
    this.UserSystemForm.setValue(new UserSystemModel().deserialize(item));
    this.openModal(template, true);
    this.isEditable = true;
  }

  deleteModal(item: UserSystemModel, template: TemplateRef<any>) {
    this.UserSystemItem = item;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.apiService.deleteUserSystem(this.UserSystemItem.id || 0).subscribe((response) => {
      this.modalRef?.hide();
      this.getUserSystemList();
      alert("Xóa thành công!");
    });
  }

  decline(): void {
    this.modalRef?.hide();
  }

}

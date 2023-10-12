import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
import { UserModel } from 'src/models/model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  title: string = '';
  UserList: UserModel[] = [];
  ColumnMode = ColumnMode;
  isLoading = false;
  isEditable = false;
  UserItem!: UserModel;
  imgShow: any;
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Tên khách hàng', prop: 'name' },
    { name: 'Email', prop: 'email', cellClass: 'text-center' },
    { name: 'SĐT', prop: 'phoneNumber' },
    { name: 'Năm sinh', prop: 'dateOfBirth', pipe: this.datePipe() },
    { name: 'Địa chỉ', prop: 'address' },
    { name: 'Điểm hiện có', prop: 'pointValue' },
  ];
  bsModalRef?: BsModalRef;
  modalRef?: BsModalRef;
  UserForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('',),
    dateOfBirth: new FormControl('',),
    address: new FormControl(''),
    pointValue: new FormControl(0),
  });
  constructor(
    private apiService: ApiService,
    private _datePipe: DatePipe,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getUserList();
  }
  datePipe() {
    return {
      transform: (value: any) => this._datePipe.transform(value, 'dd/MM/yyyy'),
    };
  }
  get formUser() {
    return this.UserForm;
  }

  openModal(template: TemplateRef<any>, isEdit = false) {
    this.title = isEdit ? 'Sửa thông tin khách hàng' : 'Thêm thông tin khách hàng';
    const initialState: ModalOptions = {
      initialState: {},
      animated: true,
      ignoreBackdropClick: true,
      class: 'modal-lg',
    };
    this.bsModalRef = this.modalService.show(template, initialState);
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
  createUser() {
    this.isLoading = true;
    this.apiService
      .createUser(this.UserForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (res.status && res.statusCode === 200) {
          this.modalService.hide();
          this.getUserList();
          this.onClosePopup();
        }
      });
  }

  updateUser() {
    this.isLoading = true;
    this.apiService
      .updateUser(this.UserItem.id || 0, this.UserForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (res) {
          this.modalService.hide();
          this.getUserList();
          this.onClosePopup();
        }
      });
  }

  onClosePopup() {
    this.UserForm.reset();
    this.UserItem = new UserModel();
    this.isEditable = false;
    this.imgShow = null;
  }

  editModal(item: UserModel, template: TemplateRef<any>) {
    this.UserItem = item;
    this.UserForm.setValue(new UserModel().deserialize(item));
    this.UserForm.controls['dateOfBirth'].setValue(new Date(item.dateOfBirth));
    this.openModal(template, true);
    this.isEditable = true;
  }

  deleteModal(item: UserModel, template: TemplateRef<any>) {
    this.UserItem = item;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.apiService.deleteUser(this.UserItem.id || 0).subscribe((response) => {
      this.modalRef?.hide();
      this.getUserList();
    });
  }

  decline(): void {
    this.modalRef?.hide();
  }

}

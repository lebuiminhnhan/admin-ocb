import { Component, OnInit, TemplateRef } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
import { InfoContactModel } from 'src/models/model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-info-contact',
  templateUrl: './info-contact.component.html',
  styleUrls: ['./info-contact.component.css']
})
export class InfoContactComponent implements OnInit {

  title: string = '';
  InfoContactList: InfoContactModel[] = [];
  ColumnMode = ColumnMode;
  isLoading = false;
  isLoadingDownload = false;
  InfoContactItem!: InfoContactModel;
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Tên liên hệ', prop: 'name' },
    { name: 'Email', prop: 'email' },
    { name: 'Chức vụ', prop: 'subject' },
    { name: 'Tin nhắn', prop: 'message' },
  ];
  modalRef?: BsModalRef;
  constructor(
    private apiService: ApiService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getInfoContactList();
  }

  getInfoContactList() {
    this.isLoading = true;
    this.apiService
      .getInfoContactList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        if (response.status && response.statusCode === 200) {
          this.InfoContactList = response.data
            .map((InfoContact) => new InfoContactModel().deserialize(InfoContact))
            .reverse();
        }
      });
  }

  exportExel() {
    this.isLoadingDownload = true;
    this.apiService.exportExel()
    .pipe(
      finalize(() => {
        this.isLoadingDownload = false;
      })
    )
    .subscribe((response) => {
      console.log(response);
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = 'Thông tin liên hệ.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onClosePopup() {
    this.InfoContactItem = new InfoContactModel();
  }

  deleteModal(item: InfoContactModel, template: TemplateRef<any>) {
    this.InfoContactItem = item;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm modal-dialog-centered' });
  }

  confirm(): void {
    this.apiService.deleteInfoContact(this.InfoContactItem.id || 0).subscribe((response) => {
      this.modalRef?.hide();
      this.getInfoContactList();

      this.apiService.alertMessage("Xóa thành công!");
    });
  }

  decline(): void {
    this.modalRef?.hide();
  }
}

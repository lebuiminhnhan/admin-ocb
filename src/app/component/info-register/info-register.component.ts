import { Component, OnInit, TemplateRef } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
import { InfoRegisterModel } from 'src/models/model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-info-register',
  templateUrl: './info-register.component.html',
  styleUrls: ['./info-register.component.css']
})
export class InfoRegisterComponent implements OnInit {

  title: string = '';
  InfoRegisterList: InfoRegisterModel[] = [];
  ColumnMode = ColumnMode;
  isLoading = false;
  isLoadingDownload = false;
  InfoRegisterItem!: InfoRegisterModel;
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Email', prop: 'email' },
  ];
  modalRef?: BsModalRef;
  constructor(
    private apiService: ApiService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getInfoRegisterList();
  }

  getInfoRegisterList() {
    this.isLoading = true;
    this.apiService
      .getInfoRegisterList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        if (response.status && response.statusCode === 200) {
          this.InfoRegisterList = response.data
            .map((InfoRegister) => new InfoRegisterModel().deserialize(InfoRegister))
            .reverse();
        }
      });
  }

  exportExel() {
    this.isLoadingDownload = true;
    this.apiService.exportToExcelInfoRegister()
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
      a.download = 'Đăng kí nhận thông tin.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onClosePopup() {
    this.InfoRegisterItem = new InfoRegisterModel();
  }

  deleteModal(item: InfoRegisterModel, template: TemplateRef<any>) {
    this.InfoRegisterItem = item;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.apiService.deleteInfoRegister(this.InfoRegisterItem.id || 0).subscribe((response) => {
      this.modalRef?.hide();
      this.getInfoRegisterList();
      alert("Xóa thành công!");
    });
  }

  decline(): void {
    this.modalRef?.hide();
  }

}

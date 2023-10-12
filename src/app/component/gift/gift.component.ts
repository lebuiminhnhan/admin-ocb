import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
import { GiftModel } from 'src/models/model';
import { ApiService } from 'src/services/api.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.css'],
})
export class GiftComponent implements OnInit {
  title: string = '';
  giftList: GiftModel[] = [];
  ColumnMode = ColumnMode;
  isLoading = false;
  editor = ClassicEditor;
  isEditable = false;
  giftItem!: GiftModel;
  imgShow: any;
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Tên quà tặng', prop: 'name' },
    { name: 'Giá trị đổi', prop: 'value', cellClass: 'text-center' },
    { name: 'Hot', prop: 'isHot' },
    { name: 'Có hiệu lực từ', prop: 'dateFrom', pipe: this.datePipe() },
    { name: 'Có hiệu lực đến', prop: 'dateTo', pipe: this.datePipe() },
  ];
  bsModalRef?: BsModalRef;
  modalRef?: BsModalRef;
  giftForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    dateTo: new FormControl('', [Validators.required]),
    dateFrom: new FormControl('', [Validators.required]),
    value: new FormControl(0, [Validators.required]),
    isHot: new FormControl(false, [Validators.required]),
    image: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  constructor(
    private apiService: ApiService,
    private _datePipe: DatePipe,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getGiftList();
  }
  datePipe() {
    return {
      transform: (value: any) => this._datePipe.transform(value, 'dd/MM/yyyy'),
    };
  }
  get formGift() {
    return this.giftForm;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgShow = reader.result;
      };
      this.giftForm.controls['image'].setValue(file);
    }
  }

  openModal(template: TemplateRef<any>, isEdit = false) {
    this.title = isEdit ? 'Sửa quà tặng' : 'Thêm quà tặng';
    const initialState: ModalOptions = {
      initialState: {},
      animated: true,
      ignoreBackdropClick: true,
      class: 'modal-lg',
    };
    this.bsModalRef = this.modalService.show(template, initialState);
  }
  getGiftList() {
    this.isLoading = true;
    this.apiService
      .getGiftList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        if (response.status && response.statusCode === 200) {
          this.giftList = response.data
            .map((gift) => new GiftModel().deserialize(gift))
            .reverse();
        }
      });
  }
  createGift() {
    this.isLoading = true;
    this.apiService
      .createGift(this.giftForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (res.status && res.statusCode === 200) {
          this.modalService.hide();
          this.getGiftList();
          this.onClosePopup();
        }
      });
  }

  updateGift() {
    this.isLoading = true;
    this.giftForm.controls['image'].setValue(
      this.imgShow
    );
    this.apiService
      .updateGift(this.giftItem.id || 0, this.giftForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (res.status && res.statusCode === 200) {
          this.modalService.hide();
          this.getGiftList();
          this.onClosePopup();
        }
      });
  }

  onClosePopup() {
    this.giftForm.reset();
    this.giftItem = new GiftModel();
    this.isEditable = false;
    this.imgShow = null;
  }
  getImgbyId(id: number) {
    this.isLoading = true;
    this.apiService
      .getImageById(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (res.status && res.statusCode === 200) {
          this.imgShow = res.data;
        }
      });
  }

  editModal(item: GiftModel, template: TemplateRef<any>) {
    this.giftItem = item;
    this.giftForm.setValue(new GiftModel().deserialize(item));
    this.giftForm.controls['dateTo'].setValue(new Date(item.dateTo));
    this.giftForm.controls['dateFrom'].setValue(new Date(item.dateFrom));
    this.openModal(template, true);
    this.isEditable = true;
    this.getImgbyId(item.id || 0);
  }

  deleteModal(item: GiftModel, template: TemplateRef<any>) {
    this.giftItem = item;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.apiService.deleteGift(this.giftItem.id || 0).subscribe((response) => {
      this.modalRef?.hide();
      this.getGiftList();
    });
  }

  decline(): void {
    this.modalRef?.hide();
  }
}

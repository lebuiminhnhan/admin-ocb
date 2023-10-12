import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Input() title?: string;
  @Output() onClose = new EventEmitter();
  constructor(public modalService: BsModalService) {}

  ngOnInit() {
    console.log(this.title);

  }

  close() {
    this.onClose.emit();
    this.modalService.hide();
  }
}

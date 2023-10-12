import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GiftComponent } from '../gift/gift.component';
import { UserComponent } from '../user/user.component';
import { UserSystemComponent } from '../user-system/user-system.component';
import { InfoContactComponent } from '../info-contact/info-contact.component';
import { InfoRegisterComponent } from '../info-register/info-register.component';
import { PopupComponent } from '../popup/popup.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CKEditorModule
  ],
  declarations: [
    AdminComponent,
    GiftComponent,
    UserComponent,
    UserSystemComponent,
    InfoContactComponent,
    InfoRegisterComponent,
    PopupComponent
  ],
  providers:[DatePipe]
})
export class AdminModule {}

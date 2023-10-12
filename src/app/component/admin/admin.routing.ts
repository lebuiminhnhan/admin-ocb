import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UserComponent } from '../user/user.component';
import { UserSystemComponent } from '../user-system/user-system.component';
import { ROUTE_LINK } from 'src/helper/constants';
import { GiftComponent } from '../gift/gift.component';
import { InfoContactComponent } from '../info-contact/info-contact.component';
import { InfoRegisterComponent } from '../info-register/info-register.component';
import { SAminRole } from 'src/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {path: '', redirectTo: '/' + ROUTE_LINK.USER, pathMatch: 'full'},
      { path: ROUTE_LINK.USER, component: UserComponent },
      { path: ROUTE_LINK.USER_SYSTEM, component: UserSystemComponent, canActivate: [SAminRole] },
      { path: ROUTE_LINK.GIFT, component: GiftComponent },
      { path: ROUTE_LINK.INFO_CONTACT, component: InfoContactComponent },
      { path: ROUTE_LINK.INFO_REGISTER, component: InfoRegisterComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

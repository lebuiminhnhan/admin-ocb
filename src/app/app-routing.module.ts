import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { AdminModule } from './component/admin/admin.module';
import { LoginComponent } from './component/login/login.component';
import { ROUTE_LINK } from 'src/helper/constants';
import { AuthGuard } from 'src/services/auth.guard';

const routes: Routes = [
  {path: '', loadChildren: () => AdminModule, canActivate: [AuthGuard]},
  {path: ROUTE_LINK.LOGIN, component: LoginComponent},
  {path: '**', component: NotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

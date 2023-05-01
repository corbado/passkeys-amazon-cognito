import { RouteGuardService } from './../services/guards/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { RegisterLightComponent } from './pages/register-light/register-light.component';
import { AuthPageWrapperComponent } from './components/auth-page-wrapper/auth-page-wrapper.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';

const routes: Routes = [

  {
    path: 'conf/:email/:code',
    component: AuthPageWrapperComponent,
    canActivate: [RouteGuardService],
    children: [
      { path: '', component: ConfirmEmailComponent }
    ]
  },
  {
    path: 'auth',
    component: AuthPageWrapperComponent,
    canActivate:[RouteGuardService],
    children: [
      { path: '', component: LoginComponent },
      { path: 'reset/:code', component: ResetPasswordComponent },
      { path: 'forget', component: ForgetPasswordComponent },
      { path: 'register', component: RegisterLightComponent },
      { path: ':id', component: LoginComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}

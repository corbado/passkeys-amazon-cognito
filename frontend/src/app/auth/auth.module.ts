import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthPageWrapperComponent } from './components/auth-page-wrapper/auth-page-wrapper.component';
import { TextInputIconedComponent } from './components/text-input-iconed/text-input-iconed.component';
import { SharedModule } from '@corbado/shared/shared.module';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterLightComponent } from './pages/register-light/register-light.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';



@NgModule({
  declarations: [
    LoginComponent,
    AuthPageWrapperComponent,
    TextInputIconedComponent,
    RegisterComponent,
    RegisterLightComponent,
    ForgetPasswordComponent,
    ConfirmEmailComponent,
    ResetPasswordComponent
  ],
  exports:[],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    CookieModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }

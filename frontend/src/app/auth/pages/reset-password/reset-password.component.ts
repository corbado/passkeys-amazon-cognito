import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'ho-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  showPassword = false;
  public resetPass = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.pattern('((?=.*[a-z])(?=.*[A-Z]).{9,30})')])],
    passwordConfirm: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.pattern('((?=.*[a-z])(?=.*[A-Z]).{9,30})')])],
  });

  sent = false;
  paramsSubscription: Subscription;
  private passcode!: string;
  private mail!: string;

  constructor (
    private fb:FormBuilder,
    route: ActivatedRoute,
    private auth:AuthService,
    private router:Router,
    private notificationService:NotificationService
  ) { 
    this.resetPass.controls.email.disable();
    this.paramsSubscription = route.params.subscribe((params) => {
      try {       
        
        [this.passcode,this.mail] = params['code'].split('@');
        this.mail=this.base642str(this.mail);
        auth.verifyEmailExistence(this.mail).subscribe(
          (res)=>{
            if(!res){              
              router.navigate(['/']);
              this.notificationService.showNotification('Wrong code or email','warning',1000);
            }
            this.notificationService.showNotification('Please text a new password','success',1000);
            this.resetPass.controls.email.patchValue(this.mail);
          }
        )
      } catch (error) {
        router.navigate(['/']);
      }
    });    
  }

  ngOnInit(): void {}

resetForm(){
  if(this.resetPass.valid && this.passwordMatches()){   
    this.auth.resetPassword(
      // this.resetPass.get('email')?.value.input,    
      this.mail,    
      this.passcode,
      // this.resetPass.get('password')?.value.input
      this.resetPass.controls.password.value
    ).subscribe(
      (data)=>{
        this.notificationService.showNotification('Password saved successfully','success',1000);
        this.router.navigate(['/auth']);
      }
    );
  }
}

public passwordMatches(): boolean {
  return this.resetPass.controls.password.value === this.resetPass.controls.passwordConfirm.value;
}

public getFormGroup(id: string): FormGroup {
  return this.resetPass.get(id) as FormGroup;
}

public str2base64(str:string) {
  return window.btoa(unescape(encodeURIComponent( str )));
}
public base642str(str:string) {
  return decodeURIComponent(escape(window.atob( str )));
}

comparePassword(){
  if(this.getFormGroup('newPass').value.input !== this.getFormGroup('passConfirm').value.input){
    this.getFormGroup('passConfirm').controls['input'].setErrors({'incorrect':true})
  }else{
    this.getFormGroup('passConfirm').controls['input'].setErrors(null)
  }
}

}

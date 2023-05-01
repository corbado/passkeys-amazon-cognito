import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'ho-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  // forgetPass:FormGroup;
  loading:boolean=false;
  sent:boolean=false;

  public forgetPass = this.fb.group({email: ['', Validators.compose([Validators.required, Validators.email])]});

  constructor(private fb:FormBuilder,private authService:AuthService,private notificationService:NotificationService) { 
  }

  ngOnInit(): void {}

  sendForm(){
    if(this.forgetPass.valid){  
      this.loading=true;  
      this.authService.sendPassResetCode(this.forgetPass.get('email')?.value).subscribe(
        (res) =>{
          this.notificationService.showNotification('Mail gesendet','success',1000);
          this.sent=true;
          this.loading=false;
        },
        (err)=>{
          this.loading=false;
        }
      )
    }
  }

  public getFormGroup(id: string): FormGroup {
    return this.forgetPass.get(id) as FormGroup;
  }
}

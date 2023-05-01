import { CompanyModel } from './../../../models/company.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NotificationService } from 'src/app/services/notification.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CompanyService } from 'src/app/services/company.service';
declare var gtag:any;

@Component({
  selector: 'ho-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  company!:CompanyModel;
  sent:boolean=false;
  public showToolTip=true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService:NotificationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    public utils:UtilsService,
    private companyService:CompanyService
  ) {

    if(localStorage.getItem("hashCompany") && localStorage.getItem('hashUsed')=="false"){
      const companyHash = utils.ensure(localStorage.getItem('hashCompany')).split('&')[0];
      this.companyService.getCompanyByHash(companyHash).subscribe((res) => {
        this.company=res;
      });
    }

  }

  public registerForm = this.fb.group({
    name: this.fb.group({
      input: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
    }),
    email: this.fb.group({
      input: ['', Validators.compose([Validators.required, Validators.email])],
    }),
    password: this.fb.group({
      input: [
        '',
        Validators.compose([Validators.required, Validators.minLength(9), Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{9,30})')]),
        // Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,30})')]),
      ],
    }),
    company: this.fb.group({
      input: [
        '',
        Validators.compose([Validators.required, Validators.minLength(2)]),
      ],
    }),
  });

  ngOnInit(): void {}

  public registerUser() {
    if (this.registerForm.invalid) {
      return;
    }
    this.authService
      .registerForNewCompany(
        this.registerForm.get('email')?.get('input')?.value,
        this.registerForm.get('name')?.get('input')?.value,
        this.registerForm.get('password')?.get('input')?.value,
        this.registerForm.get('company')?.get('input')?.value
      )
      .then((done) => {
        if(localStorage.getItem('hashUsed'))localStorage.setItem('hashUsed','true')
        this.sent=true;
        this.notificationService.showNotification("Du hast dich erfolgreich registriert! Bitte bestätige Deine E-Mail-Adresse.","success",2000);
        setTimeout(() =>{this.router.navigate(['/'])},7000);
      })
      .catch((error) => {
        // console.error(error);
        // window.alert('Registration failed');
      });
  }

  public getFormGroup(id: string): FormGroup {
    return this.registerForm.get(id) as FormGroup;
  }
}

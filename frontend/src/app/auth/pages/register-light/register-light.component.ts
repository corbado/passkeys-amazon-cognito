import { CompanyModel } from '../../../models/company.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { NotificationService } from 'src/app/services/notification.service';
import { UtilsService } from 'src/app/services/utils.service';
declare var gtag:any;

@Component({
  selector: 'ho-register-light',
  templateUrl: './register-light.component.html',
  styleUrls: ['./register-light.component.scss'],
})
export class RegisterLightComponent implements OnInit {
  company!: CompanyModel;
  sent:boolean = false;
  public showToolTip = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService:NotificationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    public utils:UtilsService,
  ) {
  }

  showPassword = false;
  public registerForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: [ '', Validators.compose([Validators.required, Validators.minLength(9), Validators.pattern('((?=.*[a-z])(?=.*[A-Z]).{9,30})')]),],
    agb: [false, Validators.requiredTrue]
  });

  ngOnInit(): void {
  }

  onboardingFeedUUID = '0e52c0fe-fa5c-40d2-bd25-dc5d4d330fb9';
  onboardingFeedUUID2 = '95c1110f-8f6e-4dd1-8e0e-c0656f6b1dc5';
  public registerUser() {
    if (this.registerForm.invalid) {
      return;
    }
    console.log('registration.');
    this.authService
      .registerLight(
        this.registerForm.get('email')?.value,
        this.registerForm.get('password')?.value
      )
      .then((_done) => {
        console.log('registered.')
        if(localStorage.getItem('hashUsed'))localStorage.setItem('hashUsed','true')
        // this.sent = true;
        // this.notificationService.showNotification("Du hast dich erfolgreich registriert! Bitte bestätige Deine E-Mail-Adresse.","success",2000);
        this.authService.authenticate(
          //this.registerForm.get('email')?.get('input')?.value,
          this.registerForm.get('email')?.value,
          this.registerForm.get('password')?.value
        ).then((_done) => {
          this.router.navigate([`/spaces`]);
          const user = this.authService.getUser();
          this.notificationService.showNotification(`Hej ${user.fullname ? user.fullname : user.email}, willkommen auf Deiner hæppie Seite`, "success", 2000)
        });
      })
      .catch((_error) => {});
  }

  public getFormGroup(id: string): FormGroup {
    return this.registerForm.get(id) as FormGroup;
  }
}

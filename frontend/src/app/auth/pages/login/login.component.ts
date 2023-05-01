import { NotificationService } from 'src/app/services/notification.service';
import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'ho-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  paramsSubscription!: Subscription;

  queryParamsSubscription!: Subscription;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private googleAnalyticsService:GoogleAnalyticsService
  ) {

    this.queryParamsSubscription = this.route.queryParams.subscribe((queryParams) => {
      if(queryParams['corbadoSessionToken']!= undefined){
        let corbadoSessionToken = queryParams['corbadoSessionToken'];
        this.authService.corbadoSessionVerify(corbadoSessionToken)
          .then(res => {
            router.navigate(['/spaces'])
          })
          .catch(error => console.log(error));
      }    })


    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['id'] != undefined) {
        localStorage.setItem('hashCompany', params['id']);
        localStorage.setItem('hashUsed','false')
        router.navigate(['/auth/register'])
      }
    });

  }

  public loginForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: [ '', Validators.compose([Validators.required]),]
  });

  ngOnInit(): void { }

  public doLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService
      .authenticate(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      )
      .then(suceeded => {
        // this.googleAnalyticsService.eventEmitter("login")
        if (suceeded) {
          this.router.navigate(['/spaces']);
          const user = this.authService.getUser();
          this.notificationService.showNotification(`Hej ${user.fullname ? user.fullname : user.email}, willkommen auf Deiner hæppie Seite`, "success", 2000)
        } else {
          this.router.navigate(['/conf/0/0']);
          this.notificationService.showNotification(`Deine Email wurde noch nicht bestätigt...`, "warning", 2000)
        }
      })

  }

  public getFormGroup(id: string): FormGroup {
    return this.loginForm.get(id) as FormGroup;
  }
}

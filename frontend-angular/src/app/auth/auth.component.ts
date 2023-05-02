import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  email = '';
  password = '';
  errorMessage = '';
  queryParamsSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.queryParamsSubscription = this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['corbadoSessionToken'] != undefined) {
        let corbadoSessionToken = queryParams['corbadoSessionToken'];
        this.authService.corbadoSessionVerify(corbadoSessionToken)
          .then(res => {
            router.navigate(['/logged-in'])
          })
          .catch(error => console.log(error));
      }
    })
  }

  ngOnInit(): void {
  }

  signUp(): void {
    this.authService.signUp(this.email, this.password).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/logged-in']);
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
      }
    );
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/logged-in']);
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
      }
    );
  }

}

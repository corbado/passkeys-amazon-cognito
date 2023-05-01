import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

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

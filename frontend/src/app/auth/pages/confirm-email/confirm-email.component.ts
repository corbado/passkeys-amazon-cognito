import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';

@Component({
  selector: 'ho-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  status: 'no-login' | 'unconfirmed' | 'confirmed' | 'error' | 'email-sent' = 'no-login';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const email = params['email'];
      const code = params['code'];
      if (email && code && this.emailRegex.test(email)) {
        this.status = 'unconfirmed';
        this.authService.confirmEmail(email, code).subscribe(res => {
          if (res.confirmed) {
            this.status = 'confirmed';
            setTimeout(() => {
              this.router.navigate(['/auth/']);
            }, 5000);
          } else {
            this.status = 'error';
          }
        });
      }
    });
  }

  sendConfirmationEmail(email: string): void {
    this.authService.resendConfirmationEmail(email).subscribe(_done => this.status = 'email-sent');
  }

}

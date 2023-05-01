import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ho-auth-page-wrapper',
  templateUrl: './auth-page-wrapper.component.html',
  styleUrls: ['./auth-page-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthPageWrapperComponent implements OnInit {
  
  constructor(public router: Router) { }

  routeSub: Subscription | undefined;

  ngOnInit(): void {}

}

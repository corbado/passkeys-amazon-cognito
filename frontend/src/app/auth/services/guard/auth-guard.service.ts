import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})

// Auth Guard protects pages from accessing without login
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.auth.isAuth()) {
      await this.router.navigate(['auth']);
      return false;
    }
    // no roles
    /* if (next.data.roles && next.data.roles.indexOf(this.auth.getRole()) === -1) {
      return false;
    } */
    return true;
  }
}

import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  NavigationEnd,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { CompanyModel } from '@corbado/models/company.model';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ROLES } from 'src/app/enums/roles.enum';
import { environment } from 'src/environments/environment';
import { CompanyAccessList, CompanyService } from '../company.service';
import { NotificationService } from '../notification.service';

@Injectable({ providedIn: 'root' })

export class RouteGuardService implements CanActivate {

  constructor(
    private companyService: CompanyService,
    private auth: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private googleAnalyticsService:GoogleAnalyticsService
  ) {
    const navEndEvents=this.router.events
    .pipe(
      filter((event):event is NavigationEnd=>{
        return event instanceof NavigationEnd
      })
    )

    navEndEvents.subscribe((event: NavigationEnd)=>{
      this.googleAnalyticsService.pageView(event.urlAfterRedirects,event.urlAfterRedirects)
    })
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      switch (route.url[0].path) {
        case 'org-admin':
          return this.auth.getUser().role.name == ROLES.SuperAdmin
            ? true
            : this.denyAndNavigate();
        case 'examples':
          return this.auth.getUser().role.name == ROLES.SuperAdmin
            ? true
            : this.denyAndNavigate();
        case 'portfolio':
          const enterprise = route.params['id'];
          const result = (
            await this.companyService
              .getAccessCompaniesBuySide(this.auth.getCompany().id)
              .toPromise()
          ).map((res: CompanyAccessList) => res.company);
          return result.some(
            (e: CompanyModel) => e.id.toString() == enterprise.toString()
          )
            ? true
            : this.denyAndNavigate();
        default:
          return true;
      }
    } catch (error: any) {
      this.notificationService.showNotification(error.message, 'warning');
    }
    this.router.navigate(['/']);
    return false;
  }

  denyAndNavigate() {
    this.notificationService.showNotification(
      "You don't have access to this site.",
      'warning'
    );
    this.router.navigate(['/']);
    return false;
  }
}

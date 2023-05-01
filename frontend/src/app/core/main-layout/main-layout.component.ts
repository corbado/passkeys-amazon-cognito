import { NotificationService } from 'src/app/services/notification.service';
import { MenuService } from 'src/app/services/menu.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from '@corbado/auth/services/auth.service';

@Component({
  selector: 'ho-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements AfterViewInit {
  isExpanded = false;

  constructor(
    private route: ActivatedRoute,
    private utils: UtilsService,
    private menuService: MenuService,
    private auth: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngAfterViewInit(): void {
    this.changeRoute();
  }

  changeState(value: boolean) {
    this.isExpanded = value;
  }

  changeRoute() {
    this.utils
      .ensure(this.route)
      .url.subscribe((resp: UrlSegment[]) => {
        let route = `/${resp[0].path}`;
        if (route)
        for (let i of this.menuService.menuItemsSeller) {
          if (`/${i.path.split("/")[1]}` == route) {
            if (this.auth.getCompany().can_sell) {

              this.auth.changeIsSeller(true);
              return;
            } else {
              this.notificationService.showNotification("You don't have access to this view", "warning");
              this.router.navigate(['/dashboard']);
            }
          }
        }
        if(route!="/settings"){
          this.auth.changeIsSeller(false);
        }
        
        return;

      });
  }
}

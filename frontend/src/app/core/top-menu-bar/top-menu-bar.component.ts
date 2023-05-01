import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { SettingsUserService } from 'src/app/services/settings-user.service';
import { ROLES } from 'src/app/enums/roles.enum';
import { NotificationService } from 'src/app/services/notification.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ho-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.scss'],
})
export class TopMenuBarComponent implements OnInit, AfterViewInit {
  // menuItems: MenuItem[] = [];
  isOpen: boolean = false;
  isActive!: boolean;
  @Output() activeState = new EventEmitter<boolean>();

  currentUser: any;
  uuid: string = '';

  constructor(
    public utils: UtilsService,
    public router: Router,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public auth: AuthService,
    public settingsUserService: SettingsUserService,
    public notificationService:NotificationService,
    private googleAnalyticsService:GoogleAnalyticsService
  ) {}

  routeSub: Subscription | undefined;
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.uuid && this.auth.isAuth()) {
        this.settingsUserService.getUser().subscribe((user) => {
          this.currentUser = {
            name: user.fullname,
            email: user.email,
            picture: user.picture,
          };
          this.cd.detectChanges();
        });
      }
    }, 400);
  }

  isDirectoryPath(path: string) {
    return this.router.url==path;
  }

  changeOpen(value: boolean) {
    this.isOpen = value;
    this.activeState.emit(value);
  }

  logout() {
    try {
      this.googleAnalyticsService.event('logout', 'method', 'logout')
      this.auth.logout();
      window.location.reload();
    } catch (error) {
      this.notificationService.showNotification(
        'Log out',
        'warning',
        3000
      );
    }
  }

  isLogged() {
    return this.auth.isAuth();
  }

  isSuperAdmin() {
    return this.auth.getUser().role.name == ROLES.SuperAdmin;
  }

  openFeedback() {
    window.open(environment.feedbackForm);
  }

  typeOf(icon: string) {
    if (icon.startsWith('ci')) {
      return true;
    } else {
      return false;
    }
  }

  canSell() {
    let company = this.auth.getCompany();
    if (company.can_sell) {
      return true;
    } else {
      return false;
    }
  }
}

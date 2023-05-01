import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '@corbado/auth/services/auth.service';
import { SpaceModel } from '@corbado/models/space.model';
import { PopupService } from 'src/app/services/popup.service';
import { PostModel } from '@corbado/models/post.model';
import { CONSTANT } from '@corbado/shared/constants';
import { SettingsUserService } from 'src/app/services/settings-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpaceService } from 'src/app/services/space.service';
import { NotificationService } from 'src/app/services/notification.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { SettingsType } from '@corbado/auth/auth-user';
import { RefreshComponentsService } from 'src/app/services/refresh-components.service';
import { NgcCookieConsentService, NgcStatusChangeEvent, NgcInitializeEvent } from "ngx-cookieconsent";

@Component({
  selector: 'ho-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.scss'],
})
export class SpacesComponent implements OnInit {

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(_event: KeyboardEvent) { this.popupService.closePopup() }

  spaces: SpaceModel[] = [];
  bannerURL = CONSTANT.CLOUDBRIDGE_CUSTOM_VIEW_DEV.banner;
  space: SpaceModel = {
    id: 0,
    id_creator: 0,
    feedID: '',
    view_count: 0,
    title: 'no space loaded',
    content_title: 'no content loaded',
    id_posts: [],
    posts: []
  };
  posts: PostModel[] = [];
  content: PostModel[] = [];

  spaceIndex = 0;
  currentUserID = -1;
  currentUser: any;
  routeParamsSub: Subscription;
  routeURLSub: Subscription;
  subscriptionRefresh: Subscription;

  currentView: 'spaces' | 'settings' | 'team-spaces' = 'spaces';
  targetSettings: SettingsType = 'profile';

  private cookieSub: Subscription | undefined; // Cookie Consent sub, keep refs to sub to unsubscribe later

  constructor(
    private settingsUserService: SettingsUserService,
    private route: ActivatedRoute,
    private spaceService: SpaceService,
    private userService: SettingsUserService,
    private notif: NotificationService,
    private location: Location,
    private googleAnalyticsService: GoogleAnalyticsService,
    private refreshComponentsService: RefreshComponentsService,
    private ccService: NgcCookieConsentService,
    public popupService: PopupService,
    public auth: AuthService,
    public router: Router,
  ) {

    if (this.auth.isAuth()) {
      console.log("authenticated")
      this.cookieSub = this.ccService.statusChange$.subscribe((e: NgcStatusChangeEvent) => {
        this.userService.setCookie(e.status === 'allow').subscribe(a => {
          this.notif.stopNotification();
        });
      });
      this.userService.getCookieStatus().subscribe((accepted: boolean) => {
        if (!accepted) this.ccService.open()
      });
    }

    this.routeURLSub = this.route.url.subscribe(url => {
      if (url[1]?.path === 'settings') {
        this.currentView = 'settings';
        if (url[2]?.path) this.targetSettings = url[2].path as SettingsType;
      } else if (url[1]?.path === 'team-spaces') {
        this.currentView = 'team-spaces';
      }
    });
    this.routeParamsSub = this.route.params.subscribe(params => {
      const uuid = params['uuid'];
      const email = params['email'];
      if (uuid) {
        if (email) this.removeEmailNotifForThisFeed(uuid, email);
        // if (uuid === 'onboarding') this.triggerOnboarding();
        if (this.auth.isAuth()) this.location.replaceState('/spaces');
      }
      this.spaceService.getSpaces(uuid);
    });

    // subscribe to sender component messages
    this.subscriptionRefresh = this.refreshComponentsService.getSettingsUpdate().subscribe
      (data => {
        if (data.fullname)
          this.currentUser.name = data.fullname; // if user´s name is changed

        if (data.name)
          this.currentUser.company.name = data.name; // if company's name is changed
        if (data.picture) {
          this.ngOnInit()
        }
      })
  }

  ngOnInit() {
    if (this.auth.isAuth()) {
      this.settingsUserService.getUser().subscribe((user) => {
        if (user && user.id) {
          this.currentUserID = user.id as number;
        }
      });
    }
    setTimeout(() => {
      if (this.auth.isAuth()) {
        this.settingsUserService.getUser().subscribe((user) => {
          this.currentUser = {
            name: user.fullname,
            email: user.email,
            picture: user.picture,
            company: user.company
          };
        });
      }
    }, 500);
  }

  removeEmailNotifForThisFeed(uuid: string, email: string): void {
    if (!this.auth.isAuth()) this.spaceService.removeMailFromNotifs(uuid, email).subscribe(_ => this.notif.showNotification('Your email has been removed from the notification list for this space', 'success', 5000));
    // TODO add else just in case
  }

  logout() {
    try {
      this.googleAnalyticsService.event('logout', 'method', 'logout')
      this.auth.logout();
      window.location.reload();
    } catch (error) {
      this.notif.showNotification(
        'Log out',
        'warning',
        3000
      );
    }
  }

  goToSettings() {
    this.currentView = 'settings';
    this.location.replaceState('/spaces/settings');
  }

  goToTeamSpaces() {
    this.currentView = 'team-spaces';
    this.location.replaceState('/spaces/team-spaces');
  }

  notImplemented() {
    this.notif.showNotification('Coming soon...', 'warning', 3000);
  }
  ngOnDestroy() { // It's a good practice to unsubscribe to ensure no memory leaks
    this.subscriptionRefresh.unsubscribe();
    this.cookieSub?.unsubscribe();
  }
}

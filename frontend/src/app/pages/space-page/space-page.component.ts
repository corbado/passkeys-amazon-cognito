import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { AuthService } from '@corbado/auth/services/auth.service';
import { SpaceModel } from '@corbado/models/space.model';
import { PostModel } from '@corbado/models/post.model';
import { SpacePage } from '@corbado/models/space-page.model';
import { UserInfo } from '@corbado/models/user.model';
import { CONSTANT } from '@corbado/shared/constants';
import { SpaceService } from 'src/app/services/space.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PopupService } from 'src/app/services/popup.service';
import { SettingsUserService } from 'src/app/services/settings-user.service';
import { RefreshComponentsService } from 'src/app/services/refresh-components.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ho-space-page',
  templateUrl: './space-page.component.html',
  styleUrls: ['./space-page.component.scss'],
})
export class SpacePageComponent {

  @HostListener('document:mouseup', ['$event.target'])
  onKeydownHandler(target: HTMLElement) {
    if (target.className !== 'ci-More_Horizontal') {
      this.currentPageSubMenu = '';
    }
  }

  space: SpaceModel = CONSTANT.DEFAULT_SPACE;
  page: SpacePage | undefined;
  content: PostModel[] = [];
  subscriptionRefresh: Subscription;


  newTitle = '';

  spaceOnline = true;
  contentCheck = true;
  pageTitleEditMode = false;
  newPageTitle = '';

  spaceTeamCheck = false;
  currentPageSubMenu = '';
  currentUser: any;

  emptyPage: SpacePage = {
    pageID: '',
    name: '',
    title: 'No page selected',
    type: 'content'
  }

  constructor(
    public auth: AuthService,
    public spaceService: SpaceService,
    private popupService: PopupService,
    private cd: ChangeDetectorRef,
    private settingsUserService: SettingsUserService,
    private notif: NotificationService,
    private refreshComponentsService: RefreshComponentsService
  ) {
    this.spaceService.space$.subscribe((feed) => {
      this.space = feed;
      if (this.space.pages) this.page = this.space.pages[0];
      this.filterContent();

    });

    this.spaceService.pageUUID$.subscribe(uuid => {
      const foundPage = this.spaceService.spaceSubject.value.pages?.find(p => p.pageID === uuid);
      if (foundPage) {
        this.page = foundPage;
        if (this.page.type === 'content') {
          this.filterContent();
        }
        if (this.page.type === 'team') {
          this.createPageContent();
        }
      } else {
        console.log('No Page');
        this.page = undefined;
        this.content = [];
        this.usersInfo = [];
      }
    });

    setTimeout(() => {
      if (this.auth.isAuth()) {
        this.settingsUserService.getUser().subscribe((user) => {
          this.currentUser = {
            name: user.fullname,
            email: user.email,
            picture: user.picture,
          };
        });
      }
    }, 200);
    this.subscriptionRefresh = this.refreshComponentsService.getContentsUpdate().subscribe
      (data => {
        //this.filterContent();
        this.sortContent(false);
      })
  }

  sortContent(value: boolean) {
    function getTimestamp(_: any) {
      let dateObject = new Date(_.timestamp?.value || 0);
      let timestamp = dateObject.getTime();
      return timestamp;
    }
    if (value) {
      this.content.sort((a, b) => {
        return getTimestamp(b) - getTimestamp(a);
      });

    }
    if (!value) {
      this.content.sort((a, b) => {
        return getTimestamp(a) - getTimestamp(b);
      });

    }
  }

  filterContent() {
    this.usersInfo = [];
    this.contentCheck = this.space.sub_menus?.some(s => s === 'content') ? true : false;
    if (this.space.posts_order && this.space.posts_order.length === this.space.posts?.length) {
      this.content = [];
      const order = this.space.posts_order;
      for (let i = 0; i < order.length; i++) {
        const postElem = this.space.posts.find(p => p.id == order[i]);
        if (postElem && !(postElem.content || postElem.type === 'text')) this.content.push(postElem);
      }

    } else {
      if (this.page) this.content = this.space.posts?.filter(p => !p.content && p.pageID === this.page?.pageID);
      else this.content = this.space.posts?.filter(p => !p.content);

      if (this.content.length > 0 && this.content.some(p => p.index != undefined)) {
        console.log('indexed content');
        this.content.sort((p1, p2) => {
          if (p1.index != undefined && p2.index != undefined) return p2.index - p1.index;
          else return 0;
        });
        if (this.content.some(p => p.index === undefined)) {
          console.log('patially indexed content');
          this.notif.showNotification('There was a problem in the indexation of your content, please reload the page', 'warning', 3000);
        }
      } else {
        console.log('non indexed content');
        for (let i = 0; i < this.content.length; i++) {
          this.content[i].index = this.content.length - (i + 1);
          this.spaceService.updateContent(this.content).subscribe(answer => {
            console.log('Forced update to index content');
            this.notif.stopNotification();
          });
        }
      }
    }

  }

  usersInfo: UserInfo[] = [];
  createPageContent() {
    this.content = [];
    if (this.page?.uuid_users?.length && this.page.uuid_users.length > 0) {
      this.spaceService.getTeamPage(this.page.pageID).subscribe(usersInfo => {
        const array = this.page?.uuid_users ? this.page?.uuid_users : [];
        this.usersInfo = usersInfo.sort((a, b) => array.indexOf(a.userID) - array.indexOf(b.userID));
      });
    }
  }

  pageTitleEditReq() {
    this.pageTitleEditMode = true;
    this.newPageTitle = this.space.content_title;
  }

  getDefaultTitle(): string {
    if (this.page?.type === 'content') {
      if (this.space.content_title) return this.space.content_title;
      else return 'A quick recap'
    };
    if (this.page?.type === 'team') return 'Your Project Team';
    else return 'No Page Selected';
  }

  changePageTitle() {
    if (this.spaceService.oldSpace) {
      this.space.content_title = this.newPageTitle;
      if (this.page) this.page.title = this.newPageTitle;
      this.spaceService.updateSpace(this.space).subscribe(_r => {
        this.notif.stopNotification();
        this.pageTitleEditMode = false;
        this.getDefaultTitle();
        this.cd.detectChanges();
      });
      return;
    }
    if (this.page && this.newPageTitle !== this.page.title) {
      this.page.title = this.newPageTitle;
      console.log(`Update page title to ${this.page.title}`);
      this.spaceService.updatePage(this.page).subscribe((_res) => {
        this.notif.stopNotification();
      });
    }
    this.pageTitleEditMode = false;
  }

  hasEditRights(): boolean {
    if (
      this.auth.isAuth() && this.space && this.currentUser &&
      (this.space.id_creator === this.currentUser.id) ||
      (this.space?.author?.company && this.settingsUserService.getCurrentUser() && this.space.author?.company?.id === this.settingsUserService.getCurrentUser().company.id)
    ) {
      return true;
    }
    return false;
  }

  onMovePostReq(event: { direction: number, objectID: string, type: string }) {
    const direction = event.direction; // +1 for UP, -1 for DOWN
    if (event.type === 'content') {
      const contentCopyReversed = [...this.content].reverse();
      const foundIndex = contentCopyReversed.findIndex(p => p.postID === event.objectID);
      if ((foundIndex === 0 && direction === -1) || (foundIndex === this.content.length - 1 && direction === 1)) return;
      for (let i = 0; i < this.content.length; i++) {
        if (i === foundIndex) contentCopyReversed[i].index = i + direction;
        else if (i === foundIndex + direction) contentCopyReversed[i].index = foundIndex;
        else contentCopyReversed[i].index = i;
      }
      this.spaceService.updateContent(contentCopyReversed).subscribe(_answer => {
        this.content = contentCopyReversed;
        this.content.sort((p1, p2) => {
          if (p1.index != undefined && p2.index != undefined) return p2.index - p1.index;
          else return 0;
        });
        this.notif.stopNotification();
      });
    } else if (event.type === 'user' && this.page && this.page.uuid_users) {
      const foundIndex = this.page.uuid_users.findIndex(uuid => uuid === event.objectID);
      if ((foundIndex === 0 && direction === -1) || (foundIndex === this.page.uuid_users.length - 1 && direction === 1)) return;
      const uuid_users = [...this.page.uuid_users];
      const newUUIDs = [];
      for (let i = 0; i < uuid_users.length; i++) {
        if (i === foundIndex && direction === 1) {
          newUUIDs.push(uuid_users[foundIndex + 1]);
          newUUIDs.push(uuid_users[foundIndex]);
          i++;
        } else if (i === foundIndex + direction && direction === -1) {
          newUUIDs.push(uuid_users[foundIndex]);
          newUUIDs.push(uuid_users[foundIndex - 1]);
          i++;
        } else {
          newUUIDs.push(uuid_users[i]);
        }
        this.page.uuid_users = newUUIDs;
        this.spaceService.updatePage(this.page).subscribe(a => {
          this.createPageContent();
          this.notif.stopNotification();
        });
      }
    }
  }

  onRemoveUserReq(uuid: string): void {
    if (!this.page || !this.page.uuid_users) return;

    const foundIndex = this.page.uuid_users.findIndex(u => u === uuid);
    if (foundIndex >= 0) {
      this.page.uuid_users.splice(foundIndex, 1);
      this.spaceService.updatePage(this.page).subscribe(a => {
        this.createPageContent();
        this.notif.stopNotification();
      })
      // this.createPageContent();
    }
  }

  shareContent() {
    this.popupService.openPopup('share-content', undefined);
  }

  addTeamMember() {
    this.popupService.openPopup('team', undefined);
  }
}

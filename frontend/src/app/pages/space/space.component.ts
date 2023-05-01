import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '@corbado/auth/services/auth.service';
import { Author, SpaceModel } from '@corbado/models/space.model';
import { PostModel } from '@corbado/models/post.model';
import { PublicFile } from '@corbado/models/public-file.model';
import { CONSTANT } from '@corbado/shared/constants';
import { SpaceService } from 'src/app/services/space.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PopupService } from 'src/app/services/popup.service';
import { SettingsUserService } from 'src/app/services/settings-user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ho-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss'],
})
export class SpaceComponent {

  @ViewChild('title') titleInputElement: ElementRef | undefined;
  @ViewChild('imgInput') imgInputRef: ElementRef | undefined;
  @ViewChild('commentWriterRef') commentWriterElement: ElementRef | undefined;

  onEnter(event: Event) {
    if (!this.shiftPressed) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      this.postComment();
      setTimeout(() => {
        if (this.commentWriterElement) this.commentWriterElement.nativeElement.value = '';
        this.autogrow();
      }, 200);
    }
  }

  shiftPressed = false;
  onShift() {
    this.shiftPressed = true;
  }

  onUnShift() {
    this.shiftPressed = false;
  }

  space: SpaceModel = CONSTANT.DEFAULT_SPACE;
  posts: PostModel[] = [];
  content: PostModel[] = [];
  titleEditMode = true;
  pageTitleEditMode = false;
  newTitle = '';
  newPageTitle = '';
  bannerURL = environment.development ? CONSTANT.CLOUDBRIDGE_CUSTOM_VIEW_DEV.banner : CONSTANT.CLOUDBRIDGE_CUSTOM_VIEW.banner;
  logoURL = environment.development ? CONSTANT.CLOUDBRIDGE_CUSTOM_VIEW_DEV.logo : CONSTANT.CLOUDBRIDGE_CUSTOM_VIEW.logo;
  currentUser: any;
  spaceOnline = true;
  contentCheck = true;
  spaceRightsCheck = true;
  spacePasswordCheck = false;
  textPostMenuIndex = -1;
  contentTitleEditMode = false;
  newContentTitle = '';
  spaceTeamCheck = false;
  pageUUIDMenu = '';
  pageUUID = '';

  constructor(
    public auth: AuthService,
    public spaceService: SpaceService,
    private popupService: PopupService,
    private settingsUserService: SettingsUserService,
    private notif: NotificationService,
    private utils: UtilsService,
  ) {
    this.spaceService.space$.subscribe((feed) => {
      this.space = feed;
      this.contentCheck = this.space.sub_menus?.some(s => s === 'content') ? true : false;
      if (this.space.posts_order && this.space.posts_order.length === this.space.posts?.length) {
        this.posts = [];
        this.content = [];
        const order = this.space.posts_order;
        for (let i = 0; i < order.length; i++) {
          const postElem = this.space.posts.find(p => p.id == order[i]);
          if (postElem && (postElem.content || postElem.type === 'text')) this.posts.push(postElem);
          else if (postElem) this.content.push(postElem);
        }
      } else {
        this.posts = this.space.posts?.filter(p => p.content || p.type === 'text').reverse();
        this.content = this.space.posts?.filter(p => !p.content);
      }
      this.spaceRightsCheck = !(this.space.rights === 'none');

      if (this.space.password) {
        this.spacePasswordCheck = true;
        this.passwordText = this.space.password;
      }

      if (this.space.new) {
        this.titleEditReq();
      } else {
        this.titleEditMode = false;
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

    this.spaceService.pageUUID$.subscribe(uuid => {
      this.pageUUID = uuid;
    });

  }

  titleEditReq() {
    if (this.space.new || this.hasEditRights()) {
      this.titleEditMode = true;
      this.newTitle = this.space.title;
      let timer = setInterval(() => { // Timer is necessary to check if UI element is loaded
        if (this.titleInputElement && this.titleInputElement.nativeElement) {
          this.titleInputElement?.nativeElement.focus();
          this.titleInputElement?.nativeElement.select();
          clearInterval(timer);
        }
      }, 100); // timer checks every 100ms
    }
  }

  contentEditReq() {
    this.contentTitleEditMode = true;
    this.newContentTitle = this.space.content_title;
  }

  changeTitle() {
    if (this.newTitle !== this.space.title) {
      this.space.title = this.newTitle;
      this.spaceService.updateSpace(this.space).subscribe((resp) => {
        if (resp[0] === 1) {
          this.notif.stopNotification();
        } else {
          this.notif.showNotification('There was a problem updating the title, please reload the page and try again.', 'warning', 3000);
        }
      });
    }
    this.titleEditMode = false;
    if (this.space.new) delete this.space.new;
  }

  changeContentTitle() {
    if (this.newContentTitle !== this.space.content_title) {
      this.space.content_title = this.newContentTitle;
      this.spaceService.updateSpace(this.space).subscribe((_res) => {
        this.notif.stopNotification();
      });
    }
    this.contentTitleEditMode = false;
  }

  imgEditReq() {
    this.imgInputRef?.nativeElement.click();
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

  handle(event: any): void {
    if (event && event.target && event.target.files) {
      const files = event.target.files;
      if (files.length > 0 && files.length < 2) {
        const file = files[0];
        console.log('Upload and update feed picture');
        if (file.size > CONSTANT.MAX_FILE_SIZE_MB * 1000000) {
          this.notif.showNotification(`File too large! Max file size ${CONSTANT.MAX_FILE_SIZE_MB}MB.`, 'warning', 5000);
        } else {
          this.utils.uploadFile(file).subscribe((newFile: PublicFile) => {
            this.space.banner_url = newFile.url;
            this.spaceService.updateSpace(this.space).subscribe(_spaceUpd => {
              this.notif.stopNotification();
            });
          });
        }
      }
    }
  }

  autogrow() {
    const textArea = this.commentWriterElement?.nativeElement;
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
    textArea.style.zIndex = "-1";
  }

  postComment(event?: any): void {
    if (this.commentWriterElement?.nativeElement.value) {
      const textArea = this.commentWriterElement.nativeElement;
      const currentAuthor: Author = {
        name: this.currentUser.name,
        picture: this.currentUser.picture
      }
      const newPost: PostModel = {
        id_creator: this.auth.isAuth() ? parseInt(this.auth.getUserID() + '') : -1,
        guest_name: this.spaceService.guestName ? this.spaceService.guestName : undefined,
        guest_mail: this.spaceService.guestMail ? this.spaceService.guestMail : undefined,
        link_open_count: 0,
        author: currentAuthor,
        content: textArea.value,
        type: 'text'
      };

      if (this.auth.isAuth() || this.spaceService.guestName) {
        if (event) {
          event.stopPropagation();
        }
        this.spaceService.uploadPost(newPost);
        this.commentWriterElement.nativeElement.value = '';
        this.autogrow();

      } else {
        if (event) {
          event.stopPropagation();
        }

        this.popupService.openPopup('guest-name', newPost);
      }
    }
  }

  shareSpace() {
    this.popupService.openPopup('share-space');
  }

  changePageTitle() {
    if (this.newPageTitle && this.newPageTitle !== this.space.page_title) {
      this.space.page_title = this.newPageTitle;
      this.spaceService.updateSpace(this.space).subscribe(_a => {
        this.notif.stopNotification();
      })
    }
    this.pageTitleEditMode = false;
  }

  editPageTitle() {
    this.pageTitleEditMode = true;
  }

  openTextPostMenu(i: number) {
    if (this.textPostMenuIndex === i) {
      this.textPostMenuIndex = -1;
    } else {
      this.textPostMenuIndex = i;
    }
  }

  iconsMenuStyle = { 'position': 'fixed', 'z-index': 20, 'top.px': 6, 'left.px': -260};
  iconsMenuUUID = '';
  currentIcon = '';

  iconsList = ['ci-Star', 'ci-Chart_Bar_Vertical_01', 'ci-Handbag', 'ci-Book', 'ci-Bookmark', 'ci-Link', 'ci-Heart_01', 'ci-Chart_Line', 'ci-Mobile_Button', 'ci-Monitor', 'ci-Laptop', 'ci-Calendar', 'ci-Clock', 'ci-Compass', 'ci-Navigation', 'ci-Map', 'ci-Building_03', 'ci-User_01', 'ci-Users', 'ci-Cloud', 'ci-File_Upload', 'ci-File_Blank', 'ci-Note', 'ci-Folder', 'ci-Chat_Circle', 'ci-Mail', 'ci-Paper_Plane', 'ci-Play', 'ci-Image_01', 'ci-Headphones', 'ci-Layers', 'ci-Table', 'ci-Rows', 'ci-Puzzle', 'ci-Sun', 'ci-Bulb', 'ci-Planet', 'ci-Leaf', 'ci-First_Aid', 'ci-Moon', 'ci-Cookie', 'ci-Water_Drop', 'ci-Cupcake', 'ci-Rainbow', 'ci-Coffe_To_Go', 'ci-Coffee', 'ci-House_Check'];
  toggleIconMenu(event: MouseEvent, pageUUID: string) {
    if (this.spaceService.currentUserHasEditRights()) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      const page = this.space.pages?.find(p => p.pageID === pageUUID);
      this.currentIcon = page?.icon_link ? page.icon_link : 'ci-File_Blank';
      console.log(`Current icon: ${this.currentIcon}`);
      if (this.iconsMenuUUID === pageUUID) this.iconsMenuUUID = '';
      else {
        const diff = window.innerHeight - event.y;
        this.iconsMenuStyle['left.px'] = event.x + 20;
        if (diff < 100) {
          this.iconsMenuStyle['top.px'] = -(160 - diff);
        } else {
          this.iconsMenuStyle['top.px'] = event.y + 10;
        }
        this.iconsMenuUUID = pageUUID;
      };
    }
  }

  changePageIcon(iconClass: string) {
    const page = this.space.pages?.find(p => p.pageID === this.iconsMenuUUID);
    if (page && this.spaceService.currentUserHasEditRights() && iconClass !== this.currentIcon) {
      page.icon_link = iconClass;
      this.spaceService.updatePage(page).subscribe(_a => {
        this.iconsMenuUUID = '';
        this.currentIcon = '';
        this.notif.stopNotification();
      });
    }
  }

  deleteTextPostReq(postId: any) {
    this.spaceService.removePost(postId);
    this.textPostMenuIndex = -1;
  }

  shareContent() {
    this.popupService.openPopup('share-content', undefined);
  }

  showPassword = false;
  transitionTime = '.2s';
  sideMenuStyle = {};
  sideMenuType: '' | 'settings' | 'analytics' = '';
  openSideMenu(type: 'settings' | 'analytics') {
    this.sideMenuType = type;
    this.sideMenuStyle = { width: "360px", transition: `width ${this.transitionTime}`, overflow: 'hidden', padding: '16px' };
  }

  closeSideMenu() {
    this.sideMenuStyle = { width: "0px", transition: `width ${this.transitionTime}`, overflow: 'hidden', padding: '0px' };
  }

  subscribeSpaceReq(): void {
    this.popupService.openPopup('get-email');
  }

  getContentHTML(stringContent: string) {
    let content = stringContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    content = content.replace(exp, "<a href='$1'>$1</a>");
    var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    content = content.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
    return content;
  }

  changeSpaceTeam(): void {
    this.spaceTeamCheck = !this.spaceTeamCheck;
  }

  changeSpaceRights(): void {
    if (this.space && this.space.id) {
      setTimeout(() => {
        const rights = this.spaceRightsCheck ? 'all' : 'none';
        this.spaceService.updateFeedRights(this.space.id, rights).subscribe((_res) => {
          this.space.rights = rights;
          this.notif.stopNotification();
        });
      }, 50);
    }
  }

  passwordText = ''
  changeSpacePassword(): void {
    if (this.passwordText && this.passwordText != this.space.password) {
      console.log('Updating password protection');
      this.spaceService.updateFeedPassword(this.space.id, this.passwordText).subscribe(res => {
        if (res) {
          this.notif.showNotification('Password protection updated.', 'success', 3000);
        }
      });
    }
    setTimeout(() => {
      if (!this.spacePasswordCheck) {
        console.log('Removing password protection');
        this.spaceService.updateFeedPassword(this.space.id, '').subscribe(res => {
          if (res) {
            this.notif.showNotification('Password protection removed.', 'success', 3000);
            this.passwordText = '';
            this.space.password = '';
          }
        });
      }
    }, 50);
  }

  async movePost(data: { direction: number, postID: number, text: boolean }) {
    let toChange: PostModel[];
    let otherIndexes: number[] = [];

    this.notif.showNotification('changing post order', 'loading', 3000);

    if (data.text) {
      toChange = this.posts;
      otherIndexes = this.content.map(p => parseInt(p.id + ''));
    } else {
      toChange = this.content;
      otherIndexes = this.posts.map(p => parseInt(p.id + ''));
    }
    const postIndex = toChange.findIndex(post => post.id == data.postID);
    const targetIndex = postIndex + data.direction;
    if (targetIndex >= 0 && targetIndex <= toChange.length) {
      const postID = toChange.splice(postIndex, 1)[0];
      toChange.splice(targetIndex, 0, postID);
      const newIndexes = toChange.map(p => parseInt(p.id + ''));
      const totIndexes = [...otherIndexes, ...newIndexes];
      if (totIndexes.length === this.space.id_posts.length) {
        this.space.posts_order = totIndexes;
        const spaceUpd = await this.spaceService.updateSpace(this.space).toPromise();
        if (spaceUpd) {
          this.notif.stopNotification();
          this.notif.showNotification('changed post order, refresh page to verify.', 'success', 2500);
        };
      }
    }
  }

  pageMenuStyle = {};
  switchToSpacePage(pageUUID: string, _event: MouseEvent): void {
    this.spaceService.changePage(pageUUID);
  }

  createPageReq(): void {
    this.popupService.openPopup('create-page');
  }

  @HostListener('document:mouseup', ['$event.target'])
  onMouseUpHandler(target: HTMLElement) {
    if (target.className !== 'ci-More_Horizontal') {
      this.pageUUIDMenu = '';
      this.textPostMenuIndex = -1;
    }
  }

  pagesSubMenuStyle = { 'position': 'absolute', 'z-index': 10, 'top.px': 6 };

  openPagesMenu(pageID: string, event: MouseEvent): void {
    event.stopImmediatePropagation();
    event.stopPropagation();
    if (this.pageUUIDMenu === pageID) this.pageUUIDMenu = '';
    else {
      const diff = window.innerHeight - event.y;
      if (diff < 160) {
        this.pagesSubMenuStyle['top.px'] = -(160 - diff);
      } else {
        this.pagesSubMenuStyle['top.px'] = 6;
      }
      this.pageUUIDMenu = pageID;
    };
  }

  deletePage(pageID: string): void {
    this.spaceService.deletePage(pageID);
  }

  renamePage(): void {
    const targetPage = this.space.pages?.find(p => p.pageID === this.pageUUIDMenu);
    if (targetPage) {
      this.popupService.pageData = targetPage;
      this.popupService.openPopup('edit-page');
    }
  }

  movePage(index: number, direction: number): void {

    if (!this.space.pages || this.space.pages.length === 0) {
      return;
    }
    let page1, page2;
    if (direction > 0) { // move DOWN
      if (this.space.pages.length > index + 1) {
        page1 = this.space.pages[index];
        page2 = this.space.pages[index + 1];
        page1.index = index + 1;
        page2.index = index;
      }
    } else { // move UP
      if (index > 0) {
        page1 = this.space.pages[index];
        page2 = this.space.pages[index - 1];
        page1.index = index - 1;
        page2.index = index;
      }
    }
    if (page1 && page2) {
      console.log(`Swapping ${page1.name} and ${page2.name}`);
      this.spaceService.updatePage(page1).subscribe(_r => {
        this.notif.stopNotification();
      });
      this.spaceService.updatePage(page2).subscribe(_r => {
        this.notif.stopNotification();
      });
      // @ts-ignore
      this.space.pages.sort((p1, p2) => p1.index - p2.index);
    }
  }

  supportsPages(): boolean {
    if (this.space.pages?.some(p => p.pageID === 'defaultContentPage')) return false;
    else return true;
  }

  updateSpaceSubMenus() {
    setTimeout(() => {
      const submenus = this.contentCheck ? ['content'] : [];
      this.space.sub_menus = submenus;
    }, 100);
  }

  menuAvailable(menu: string): boolean {
    return this.space.sub_menus?.some(s => s === menu) ? true : false;
  }

  removeMailFromNotification(email: string) {
  }

  notImplemented() {
    this.notif.showNotification('Coming soon...', 'warning', 3000);
  }

  toHomePage(): void {
    window.open(CONSTANT.CORBADO_WEBPAGE, '_blank');
  }

  openLink(link?: string) {
    if (link) window.open(link, '_blank');
  }

  openMail(mail?: string) {
    if (mail) window.open('mailto:' + mail);
  }

  openTel(tel?: string) {
    if (tel) window.open('tel:' + tel);
  }
}

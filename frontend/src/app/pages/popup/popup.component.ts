import { Component, Input, OnInit, AfterContentInit, HostListener, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { ContentType, PostModel } from '@corbado/models/post.model';
import { FileType, PopupType } from '@corbado/models/popup.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '@corbado/auth/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SpaceService } from 'src/app/services/space.service';
import { UtilsService } from 'src/app/services/utils.service';
import { PublicFile } from '@corbado/models/public-file.model';
import { CONSTANT } from '@corbado/shared/constants';
import { PopupService } from 'src/app/services/popup.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthUser } from '@corbado/auth/auth-user';
import { SpacePage, SpacePageType } from '@corbado/models/space-page.model';
import { CompanyModel } from '@corbado/models/company.model';
import { RefreshComponentsService } from 'src/app/services/refresh-components.service';

@Component({
  selector: 'ho-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PopupComponent implements OnInit, AfterContentInit {

  @Input() onboardingState = 0;
  @Input() popupType: PopupType = '';

  @ViewChild('textareaRef') textareaRef: ElementRef | undefined;
  @ViewChild('pdfInput') pdfInputRef: ElementRef | undefined;
  @ViewChild('imgInput') imgInputRef: ElementRef | undefined;
  @ViewChild('link') linkInputRef: ElementRef | undefined;

  postData: PostModel = CONSTANT.DEFAULT_POST;
  spaceLink: string = '';
  contentTitle: string = '';
  pageName: string = '';
  contentDescription: string = '';
  file: any | undefined = undefined;
  inputLink = false;
  thumbnailCheckbox = true;
  isPosting = false;
  contentType: ContentType = '';
  selectedPageType: SpacePageType | '' = '';

  @HostListener('document:click', ['$event.target'])
  documentClick(_event: MouseEvent) {
    if (this.popupType === 'copied-to-clipboard') {
      this.closePopup();
    }
  }
  
  constructor(
    public dialog: MatDialog,
    public auth: AuthService,
    private spaceService: SpaceService,
    private popupService: PopupService,
    private companyService: CompanyService,
    private utils: UtilsService,
    private clipboard: Clipboard,
    private notificationService: NotificationService,
    private refreshComponentsService: RefreshComponentsService
  ) {
  }

  ngOnInit(): void {
    this.postData = this.popupService.postData ? this.popupService.postData : JSON.parse(JSON.stringify(CONSTANT.DEFAULT_POST));
    if (this.postData.links && this.postData.links.length > 0) {
      this.inputLink = true;
      this.spaceLink = this.postData.links[0];
    }
    if (this.postData.files && this.postData.files.length > 0) {
      this.file = this.postData.files[0];
    }
    if (this.postData.title) this.contentTitle = this.postData.title;
    if (this.postData.description) this.contentDescription = this.postData.description;
    if (this.postData.hide_thumbnail) this.thumbnailCheckbox = false;
    if (this.popupType === 'edit-page') {
      if (!this.popupService.pageData) {
        this.notificationService.showNotification('Problem loading page data', 'warning', 3000);
        this.popupService.closePopup();
      } else {
        this.pageName = this.popupService.pageData.name;
        this.selectedPageType = this.popupService.pageData.type;
      }
    }
  }

  ngAfterContentInit(): void {
    if (this.popupType === 'create-post' && this.textareaRef && this.textareaRef.nativeElement) {
      this.textareaRef.nativeElement.focus();
    }
    if (this.popupType === "share-space" && this.spaceService.spaceSubject.value.feedID) {
      const spaceUUID = this.spaceService.spaceSubject.value.feedID;
      this.spaceLink = `${environment.apiUrl}spaces/preview/${spaceUUID}`;
    }
    if (this.popupType === 'team') {
      this.companyService.getCompanyMembers().subscribe(users => {
        this.teamUsers = users;
        const page = this.spaceService.getCurrentPage();
        if (page?.uuid_users) {
          this.selectedUsersUUID = page.uuid_users;
        }
      });
    }
  }

  closePopup(): void {
    this.popupService.closePopup();
  }

  openContent(fileType?: FileType): void {
    if (fileType === 'pdf') {
      this.pdfInputRef?.nativeElement.click();
    } else if (fileType === 'img') {
      this.imgInputRef?.nativeElement.click();
    }
  }

  openLinkInput(type: ContentType): void {
    this.contentType = type;
    this.inputLink = !!this.contentType;
    this.file = undefined;
    setTimeout(() => this.linkInputRef?.nativeElement.focus(), 100);
  }

  handle(event: any): void {
    if (event && event.target && event.target.files) {
      const files = event.target.files;
      if (files.length > 0 && files.length < 2) {
        this.file = files[0];
        this.inputLink = false;
      }
    }
  }

  removeFile(): void {
    this.file = undefined;
    if (this.pdfInputRef && this.pdfInputRef.nativeElement) {
      this.pdfInputRef.nativeElement.value = '';
    }
  }

  copyLinkToClipboard(): void {
    this.clipboard.copy(this.spaceLink);
    setTimeout(() => this.popupType = "copied-to-clipboard", 50);
    setTimeout(() => this.closePopup(), 5000);
  }

  // Not used anymore
  postContentReq(): void {
    const link = this.linkInputRef?.nativeElement.value;
    this.postData.id_creator = this.auth.isAuth() ? parseInt(this.auth.getUserID() + '') : -1;
    this.postData.guest_name = this.spaceService.guestName ? this.spaceService.guestName : undefined;
    this.postData.guest_mail = this.spaceService.guestMail ? this.spaceService.guestMail : undefined;
    this.postData.links = link ? [link] : [];
    if (this.auth.isAuth() || this.spaceService.guestName) {
      this.postContent();
    } else {
      if (this.spaceService.guestMail) {
        this.postContent();
      };
      this.popupType = 'guest-name';
    }
  }

  postContentReq2() {
    if (this.isPosting) {
      console.log('wait...');
      return;
    }
    this.isPosting = true;
    const link = this.linkInputRef?.nativeElement.value;
    const index = this.postData.index != undefined ? this.postData.index : this.spaceService.getCurrentPageContentLength();
    if (this.file || link) {
      this.postData.id_creator = this.auth.isAuth() ? parseInt(this.auth.getUserID() + '') : -1;
      this.postData.guest_name = this.spaceService.guestName ? this.spaceService.guestName : undefined;
      this.postData.guest_mail = this.spaceService.guestMail ? this.spaceService.guestMail : undefined;
      this.postData.links = link ? [link] : [];
      this.postData.hide_thumbnail = !this.thumbnailCheckbox;
      this.postData.title = this.contentTitle;
      this.postData.description = this.contentDescription;
      this.postData.index = index;
      this.postData.pageID = this.spaceService.pageUUIDSubject.value;
      if (this.auth.isAuth() || this.spaceService.guestName) {
        this.postContent();
      } else {
        this.popupType = 'guest-name';
      }
    }
  }

  addTeamMembers() {
    if (this.selectedUsersUUID.length > 0) {
      this.spaceService.addTeamMembersToPage(this.selectedUsersUUID);
    } else {
      this.notificationService.showNotification('No team member selected', 'warning', 3000);
    }
  }

  setNameAndMail(name: string, mail: string): void {
    this.spaceService.setGuestData(name, mail);
    this.postContent();
  }

  subscribeMailToSpace(email: string): void {
    this.spaceService.addMailToNotifs(this.spaceService.spaceSubject.value.feedID, email).subscribe(res => {
      if (res) {
        this.notificationService.showNotification('Email added to notification list', 'success', 3000);
        this.popupService.closePopup();
      }
    })
  }

  sendPassword(password: string) {
    this.spaceService.sendPassword(password);
  }

  postContent(): void {
    if (this.file) { // FILE
      if (this.file.size > CONSTANT.MAX_FILE_SIZE_MB * 1000000) {
        this.notificationService.showNotification(`File too large! Max file size ${CONSTANT.MAX_FILE_SIZE_MB}MB.`, 'warning', 5000);
        this.popupType = 'create-post';
        return;
      }
      if (this.file.id) { // file already uploaded and we only change the content of the post
        this.postData.id_files = [parseInt(this.file.id + '')];
        this.postData.files = [this.file];
        if (this.postData.id) this.spaceService.editPost(this.postData);
        else this.spaceService.uploadPost(this.postData).then(_res => this.isPosting = false);
      } else { // new file
        console.log('Uploading file');
        this.utils.uploadFile(this.file).subscribe((file: PublicFile) => {
          if (file && file.id) { // Test if file upload was successful
            this.postData.id_files = [parseInt(file.id + '')];
            this.postData.files = [file];
            if (this.postData.id) this.spaceService.editPost(this.postData);
            else this.spaceService.uploadPost(this.postData).then(_res => this.isPosting = false);
          } else {
            this.notificationService.showNotification(`File upload failed. Try again or contact the corbado team`, 'warning', 5000);
            this.popupType = 'create-post';
            return;
          }
        });
      }
    } else { // NO-FILE
      this.postData.id_files = [];
      this.postData.files = [];
      if (this.postData.parent_postID) {
        this.spaceService.addCommentAsGuest(this.postData, this.postData.parent_postID);
      } else {
        if (this.postData.id) this.spaceService.editPost(this.postData);
        else this.spaceService.uploadPost(this.postData).then(_res => this.isPosting = false);
      }
    }
    this.refreshComponentsService.sendContentsUpdate(true);

  }

  teamUsers: AuthUser[] = [];
  selectedUsersUUID: string[] = [];
  createPageReq() {
    if (!this.pageName) {
      this.notificationService.showNotification('Die neue Seite muss einen Namen haben.', 'warning', 3000);
      return;
    }
    if (!this.selectedPageType) {
      this.notificationService.showNotification('Wähle einen Seitentyp.', 'warning', 3000);
      return;
    }
    if (this.popupType === 'edit-page' && this.popupService.pageData) {
      const page = this.popupService.pageData;
      page.name = this.pageName;
      page.type = this.selectedPageType;
      this.spaceService.updatePage(page).subscribe(r => {
        this.spaceService.pageUUIDSubject.next(page.pageID);
        this.popupService.closePopup();
        this.notificationService.stopNotification();
      });
    }
    else {
      const newPage = { name: this.pageName, type: this.selectedPageType };
      this.spaceService.createPage(newPage);
    }
  }

  isSelected(uuid?: string): boolean {
    if (!uuid) return false
    return this.selectedUsersUUID.some(userID => userID === uuid);
  }

  toggleTeamUser(uuid?: string) {
    if (!uuid) {
      return;
    }
    const foundIndex = this.selectedUsersUUID.findIndex(userID => userID === uuid);
    if (foundIndex > -1) {
      this.selectedUsersUUID.splice(foundIndex, 1);
    } else {
      this.selectedUsersUUID.push(uuid);
    }
  }
}

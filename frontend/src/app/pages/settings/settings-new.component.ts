import { Input, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthUser, SettingsType } from '@corbado/auth/auth-user';
import { AuthService } from '@corbado/auth/services/auth.service';
import { CONSTANT } from '@corbado/shared/constants';
import { CompanyService } from 'src/app/services/company.service';
import { SpaceService } from 'src/app/services/space.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SettingsUserService } from 'src/app/services/settings-user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { RefreshComponentsService } from 'src/app/services/refresh-components.service';

@Component({
  selector: 'ho-settings-new',
  templateUrl: './settings-new.component.html',
  styleUrls: ['./settings-new.component.scss'],
})
export class SettingsNewComponent implements OnInit {

  @Input() currentSettingsView: SettingsType = 'company';

  @ViewChild('imgInput') imgInputRef: ElementRef | undefined;
  @ViewChild('companyPicInput') companyPicInputRef: ElementRef | undefined;

  numberOfFreeFeedsUsed = 0;
  maximumFeeds = 5;
  public userInfo: AuthUser | null = null;

  public userSettingsForm = this.fb.group({
    name: [''],
    position: [''],
    calendar: [''],
    linkedin: [''],
    spreadly: [''],
    video: [''],
    presentation: [''],
    phone: ['', [Validators.minLength(8)]],
    email: ['', [Validators.required, Validators.email]],
  });

  public companySettingsForm = this.fb.group({
    name: [''],
    website: [''],
    colleague: ['']
  });

  public planBillingSettingsForm = this.fb.group({
    nameOrCompany: [''],
    address: [''],
    zip: [''],
    city: [''],
    vat: [''],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public utils: UtilsService,
    public auth: AuthService,
    private settingsUser: SettingsUserService,
    private companyService: CompanyService,
    private feedService: SpaceService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private refreshComponentsService: RefreshComponentsService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.companyService.getCompanyMembers().subscribe(companyMembersList => this.companyMembers = companyMembersList);
  }

  companyMembers: AuthUser[] = [];
  userPicBase64string = '';
  userLazyLoad = false;
  userPicURL = '';
  userPicFilePicURL = '';
  userPicFile: any | undefined = undefined;

  companyPicBase64string = '';
  companyLazyLoad = false;
  companyPicURL = '';
  companyPicFile: any | undefined = undefined;

  handleFileInput(event: any, type: 'user' | 'company'): void {
    if (event && event.target && event.target.files) {
      const files = event.target.files;
      if (files.length > 0 && files.length < 2) {
        const file = files[0];
        if (file.size < 5500000) { // 5MB with 10% margin
          if (type === 'user') this.userPicFile = file;
          else this.companyPicFile = file;

          var reader = new FileReader();
          reader.onload = () => {
            if (type === 'user') { // user pic
              this.userPicBase64string = reader.result as string;
            } else { // company logo
              this.companyPicBase64string = reader.result as string;
            }
          };
          reader.onerror = function (_error) { };
          if (type === 'user') reader.readAsDataURL(this.userPicFile);
          else reader.readAsDataURL(this.companyPicFile);
        } else {
          this.userPicFile = undefined;
          this.notificationService.showNotification("File too large", "warning", 2000);
        }
      }
    }
  }

  editUserAvatar() {
    this.imgInputRef?.nativeElement.click();
  }

  private loadUserData() {
    this.settingsUser.getUser().subscribe((user: AuthUser) => {
      this.userInfo = user;
      this.userSettingsForm.controls['name'].setValue(user.fullname);
      this.userSettingsForm.controls['position'].setValue(user.position);
      this.userSettingsForm.controls['calendar'].setValue(user.calendar_link);
      this.userSettingsForm.controls['linkedin'].setValue(user.linkedin_link);
      this.userSettingsForm.controls['spreadly'].setValue(user.spreadly_link);
      this.userSettingsForm.controls['video'].setValue(user.video_link);
      this.userSettingsForm.controls['presentation'].setValue(user.presentation);
      this.userSettingsForm.controls['phone'].setValue(user.phone_number);
      this.userSettingsForm.controls['email'].setValue(user.email);

      this.companySettingsForm.controls['name'].setValue(user.company?.name);
      this.companySettingsForm.controls['website'].setValue(user.company?.website);

      this.planBillingSettingsForm.controls['nameOrCompany'].setValue(user.billing_json.name_or_company);
      this.planBillingSettingsForm.controls['address'].setValue(user.billing_json.address);
      this.planBillingSettingsForm.controls['city'].setValue(user.billing_json.city);
      this.planBillingSettingsForm.controls['zip'].setValue(user.billing_json.zip);
      this.planBillingSettingsForm.controls['vat'].setValue(user.billing_json.vat);

      this.isChecked = user.email_notifications;
      this.userPicBase64string = '';
      if (user.picture) {
        this.userPicBase64string = '';
        this.userLazyLoad = true;
        this.userPicURL = user.picture.url;
      }
      if (user.company?.logo && user.company.logo.url) {
        this.companyPicBase64string = '';
        this.companyLazyLoad = true;
        this.companyPicURL = user.company.logo.url;
      }
      if (this.userInfo.id_feeds) {
        this.feedService.getNumberOfSpaces();
      }
    });
  }

  public async saveUserSettings() {
    if ((!this.userSettingsForm.invalid && (!this.userSettingsForm.pristine || !this.planBillingSettingsForm.pristine)) || this.userPicFile || this.companyPicFile) {
      let billingInfo = {
        name_or_company: this.planBillingSettingsForm.controls['nameOrCompany'].value,
        address: this.planBillingSettingsForm.controls['address'].value,
        zip: this.planBillingSettingsForm.controls['zip'].value,
        city: this.planBillingSettingsForm.controls['city'].value,
        vat: this.planBillingSettingsForm.controls['vat'].value,
      };
      let values: any = {
        fullname: this.userSettingsForm.controls['name'].value,
        position: this.userSettingsForm.controls['position'].value,
        calendar_link: this.userSettingsForm.controls['calendar'].value,
        linkedin_link: this.userSettingsForm.controls['linkedin'].value,
        spreadly_link: this.userSettingsForm.controls['spreadly'].value,
        video_link: this.userSettingsForm.controls['video'].value,
        presentation: this.userSettingsForm.controls['presentation'].value,
        phone_number: this.userSettingsForm.controls['phone'].value,
        email: this.userSettingsForm.controls['email'].value,
        billing_json: billingInfo,
      };
      if (this.userPicFile) {
        const file = await this.utils.uploadFile(this.userPicFile).toPromise();
        if (file) {
          values.picture = file;
          this.userPicURL = file.url;
          this.userLazyLoad = true;
          this.userPicBase64string = '';
          values.img_base64 = '';
        }
      }
      this.saveUserChanges(values);
    }
  }

  public async saveCompanySettings() {
    let values: any = {
      name: this.companySettingsForm.controls['name'].value,
      website: this.companySettingsForm.controls['website'].value,
      id: this.auth.getCompany().id,
      uuid: this.auth.getCompany().uuid,
    };
    if (this.companyPicFile) {
      const file = await this.utils.uploadFile(this.companyPicFile).toPromise();
      if (file) {
        values.logo = file;
        this.companyPicURL = file.url;
        this.companyLazyLoad = true;
        this.companyPicBase64string = ''
      }
    }
    this.saveCompanyChanges(values);
  }

  gotToFeeds(): void {
    this.router.navigate(['feeds']);
  }

  getTitle(): string {
    let title = 'Error - please reload page';
    switch (this.currentSettingsView) {
      case 'profile':
        title = 'Dein Profil';
        break;
      case 'company':
        title = 'Company';
        break;
      case 'billing':
        title = 'Company';
        break;
      case 'email':
        title = 'Email Notifications';
        break;
      case 'push':
        title = 'Push Notifications';
        break;
      case 'crm':
        title = 'CRM Anbindung';
        break;
      case 'automation':
        title = 'Automations';
        break;
    }
    return title;
  }

  transitionTime = '.2s';
  settingsMenuStyle = {};
  goToSetting(setting?: SettingsType): void {
    if (setting) {
      this.currentSettingsView = setting;
    }
    if (window.screen.availWidth <= 600) {
      if (setting) {
        this.settingsMenuStyle = { width: "0px", transition: `width ${this.transitionTime}`, overflow: 'hidden', left: '0px' };
      } else {
        this.settingsMenuStyle = { width: "100%", transition: `width ${this.transitionTime}`, overflow: 'hidden', left: '0px' };
      }
    }
  }

  private saveUserChanges(values: any): void {
    this.settingsUser.saveUserChanges(values).subscribe((data: AuthUser) => {
      this.notificationService.showNotification("Deine Daten wurden aktualisiert", "success", 3000);
      this.settingsUser.setCurrentUser(data);
      this.userSettingsForm.markAsPristine();
      this.loadUserData();
      if (values.fullname !== this.userInfo?.fullname)
        this.refreshComponentsService.sendSettingsUpdate(data);
      if (values.picture?.url !== this.userInfo?.picture?.url)
        this.refreshComponentsService.sendSettingsUpdate(data);
    }, (_error) => {
      this.notificationService.showNotification("Speichern fehlgeschlagen", "warning", 3000);
    });
  }

  private saveCompanyChanges(values: any): void {
    this.companyService.saveCompanyChanges(values).subscribe((data: any) => {
      this.notificationService.showNotification("Deine Daten wurden aktualisiert", "success", 3000);
      this.companySettingsForm.markAsPristine();
      if (values.company !== this.userInfo?.company)
        this.refreshComponentsService.sendSettingsUpdate(data);


      this.loadUserData();
      // this.settingsUser.setCurrentUser(data);
    }, (_error: any) => {
      this.notificationService.showNotification("Speichern fehlgeschlagen", "warning", 3000);
    });
  }


  colleagues = [];
  inviteColleague(): void {

    this.notificationService.showNotification('Feature not yet implemented, contact the Hæppie team.', 'warning', 3000);

    const email = this.companySettingsForm.controls['colleague'].value;
    if (this.userInfo?.company.uuid) {
      this.companyService.inviteColleague(email, this.userInfo.company.uuid).subscribe(res => {
        if (res) {
          this.notificationService.showNotification("Deine Daten wurden aktualisiert", "success", 3000);
        } else {
          this.notificationService.showNotification("Einladung fehlgeschlagen", "warning", 3000);
        }
      });
    }
  }

  removeColleague(mail: string): void {
  }

  mailToFelix(type: string): void {
    let mail = '';
    switch (type) {
      case 'Space':
        mail = CONSTANT.SPACE_INDIVIDUALISIEREN;
        break;
      case 'Upgrade':
        mail = CONSTANT.UPGRADE;
    }
    window.location.href = mail;
  }

  goToTypeform(type: string): void {
    let url = '';
    switch (type) {
      case 'Mail':
        url = CONSTANT.FEEDBACK_MAIL;
        break;
      case 'Push':
        url = CONSTANT.FEEDBACK_PUSH;
        break;
      case 'CRM':
        url = CONSTANT.FEEDBACK_CRM;
        break;
      case 'Auto':
        url = CONSTANT.FEEDBACK_AUTO;
        break;
    }
    window.open(url, "_blank");
  }

  logout(): void {
    console.log('logout');
    this.auth.logout();
  }

  openSpreadlyLink() {
    window.open('https://spreadly.app/', '_blank')
  }

  public isChecked: boolean = true;
  public changeEmailNotifications(_event?: any): void {
    setTimeout(() => {
      if (this.userInfo) {
        this.userInfo.email_notifications = this.isChecked;
        this.saveUserChanges(this.userInfo);
      }
    }, 50);
  }
}

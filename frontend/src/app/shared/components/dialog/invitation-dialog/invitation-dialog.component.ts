import { NotificationService } from './../../../../services/notification.service';
import { CompanyService } from 'src/app/services/company.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '@corbado/auth/services/auth.service';
import { trigger,state,style,animate,transition,keyframes } from '@angular/animations';

// export const fadeAnimation = trigger('fadeAnimation', [
//   transition(':enter', [
//     style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]
//   ),
//   transition(':leave',
//     [style({ opacity: 1 }), animate('500ms', style({ opacity: 0 }))]
//   )
// ]);

// export const rightAnimation = trigger('rightAnimation', [
//   transition(':enter', [
//     style({ opacity: 0, transform: 'translateX(-100%)' }), animate('1000ms', style({ opacity: 1,transform: 'translateX(0)' }))]
//   ),
//   transition(':leave',
//     [style({ opacity: 1, transform: 'translateX(0)' }), animate('1000ms', style({ opacity: 0, transform: 'translateX(100%)' }))]
//   )
// ]);

// export const leftAnimation = trigger('leftAnimation', [
//   transition(':enter', [
//     style({ opacity: 0, transform: 'translateX(100%)' }), animate('300ms', style({ opacity: 1,transform: 'translateX(0)' }))]
//   ),
//   transition(':leave',
//     [style({ opacity: 1, transform: 'translateX(0)' }), animate('100ms', style({ opacity: 0, transform: 'translateX(-100%)' }))]
//   )
// ]);

@Component({
  selector: 'ho-invitation-dialog',
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.scss'],
  animations: [
 ]
})
export class InvitationDialogComponent implements OnInit {
  route = `${environment.apiUrlFront}`;
  multiLink=false;
  selectedLink=false;

  constructor(private companyService: CompanyService, private auth: AuthService, private notificationService: NotificationService) {
    
  }

  ngOnInit(): void {
  }

  get stateName(){
    return this.selectedLink?this.multiLink?'multi':'single':'toLink'
  }

  public copyLink() {
    navigator.clipboard.writeText(this.route);
    this.notificationService.showNotification("Yes! Dein Link wurde kopiert.", "information", 2000,"🎉");
  }

  pickLink(multi:boolean ){
    this.selectedLink=true;
    this.multiLink=multi;
    if(!multi){
      this.companyService.getHash(this.auth.getCompany().id).subscribe((resp: any) => {
        this.notificationService.showNotification("Hier ist Dein Link für die Einladung.", "success", 2000);
        this.route = `${environment.apiUrlFront}auth/${resp.hash}`;
      });
    }else{
      this.companyService.getHash(this.auth.getCompany().id,false).subscribe((resp: any) => {
        this.notificationService.showNotification("Hier ist Dein Link für die Einladung.", "success", 2000);
        this.route = `${environment.apiUrlFront}auth/${resp.hash}`;
      });
    }
  }

}

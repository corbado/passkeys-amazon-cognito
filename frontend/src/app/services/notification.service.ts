import { UtilsService } from './utils.service';
import { ToastComponent } from './../shared/components/toast/toast.component';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { MatSnackBar} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { interval, Observable, Subscription, timer } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';
import { NotificationModel } from '@corbado/models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private notificationSubscription!: Subscription;
  private startTime!:number;
  private userNotifications:NotificationModel[]=[];

  constructor(
    public snackBar: MatSnackBar,
    private utilsService: UtilsService,
    private http:HttpClient
  ) {}

  public init(){
    if(!this.notificationSubscription || this.notificationSubscription.closed){
      this.startTime = new Date().getTime();
      const delayTime = 60000; //Every Minute
      this.notificationSubscription = timer(0, delayTime)
      .pipe(      
        mergeMap(() =>{return this.http.get<NotificationModel[]>(`${environment.apiUrl}notification`)})
      ).subscribe((data:NotificationModel[]) => {
        this.addNewNotifications(data);
      },
      (err)=>{
        console.error('Error at notification subscription'+err);
      },
      ()=>{this.showNotification('Notifications Closed Correctly','success',1000)});
    }
  }

  public stop(){
    if(this.notificationSubscription){
      this.notificationSubscription.unsubscribe();
    }
  }

  private addNewNotifications(notifications:NotificationModel[]){
    const onlyInB = this.filterArray(notifications,this.userNotifications, (a:NotificationModel,b:NotificationModel)=>a.id == b.id);
    if(onlyInB.length>0){
      this.userNotifications=this.userNotifications.concat(onlyInB);
    }
  }

  public changeNotificationSeenStatus(id:number|string){
    return this.http.post<NotificationModel>(`${environment.apiUrl}notification/${id}`,undefined);
  }

  public sendNotificationToAdmins(message:string,subject:string){
    return this.http.post(`${environment.apiUrl}mail/toAdmins`,{message,subject});
  }

  public sendMail(message: string, subject: string, to: string): Observable<any> {
    const data = {message,subject,to};
    return this.http.post<any>(`${environment.apiUrl}mail`, data);
  }

  private filterArray = (left:NotificationModel[],right:NotificationModel[],compareFunction:any) => left.filter(leftValue => !right.some(rightValue => compareFunction(leftValue, rightValue)));

  public getCurrentNotifications(type?:string):NotificationModel[] {
    if(type){
      return this.userNotifications.filter((notification:NotificationModel)=>notification.type.name==type);
    }
    return this.userNotifications;
  }

  public stopNotification(): void {
    this.snackBar.dismiss();
  }

  public showNotification(message: string, kindNotification:"information"|"success"|"warning"|"loading",duration?:number,emoji?:string) {
    this.snackBar.openFromComponent(ToastComponent, {
      duration:duration?duration:10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: { 
        message: message,
        class:kindNotification,
        emoji:emoji?emoji:null
      },
    });
  }
}

import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@corbado/auth/services/auth.service';
import { InquirieMessageModel, InquirieModel } from '@corbado/models/inquirie.model';
import { State } from '@corbado/models/state.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class InquiriesService {

  inquiryStates: State[] = [];


  constructor(private http: HttpClient, private auth: AuthService, private notificationService: NotificationService) {
    // this.updateInquiryStates();
  }

  returnCurrentInquiries(): Observable<InquirieModel[]> {
    if (this.auth.getIsSeller()) {
      return this.http.get<InquirieModel[]>(`${environment.apiUrl}companies/${this.auth.getCompany().id}/inquiries/sellSide`);

    }
    return this.http.get<InquirieModel[]>(`${environment.apiUrl}companies/${this.auth.getCompany().id}/inquiries/buySide`);
  }

  getInquiry(id: number | string): Observable<InquirieModel> {
    return this.http.get<InquirieModel>(`${environment.apiUrl}inquiries/${id}`);
  }

  sendInquiry(id: number | string):Observable<InquirieModel> {
    return this.http.post<InquirieModel>(`${environment.apiUrl}inquiries/${id}/send`, undefined);
  }

  updateInquiry(id: number | string, newValue: InquirieModel): Observable<InquirieModel> {
    return this.http.post<InquirieModel>(`${environment.apiUrl}inquiries/${id}`, newValue);
  }

  sendMessage(id: number | string, message: string): Observable<InquirieMessageModel> {
    return this.http.put<InquirieMessageModel>(`${environment.apiUrl}inquiries/${id}/messages`, { message });
  }

  updateInquiryStates() {
    this.http.get<State[]>(`${environment.apiUrl}inquiries/states`).subscribe((res: State[]) => { this.inquiryStates = res });
  }

  getInquiryStates(): State[] {
    return this.inquiryStates;
  }

  deleteInquiry(id:number|string):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}inquiries/${id}`)
  }

  //GetInquiries
}

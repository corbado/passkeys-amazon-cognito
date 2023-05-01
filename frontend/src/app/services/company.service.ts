import { Injectable } from '@angular/core';
import { CompanyModel } from '@corbado/models/company.model';
import { DateModel } from '@corbado/models/date.model';
import { AuthService } from '@corbado/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUser } from '@corbado/auth/auth-user';
import { SpaceModel } from '@corbado/models/space.model';

export interface CompanyAccessList {
  accepted: boolean;
  company: CompanyModel;
  date: DateModel;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getAllCompanies() {
    return this.http.get<CompanyModel[]>(`${environment.apiUrl}companies`);
  }

  getAccessCompaniesSellSide(idCompany: number | string): Observable<CompanyAccessList[]> {
    return this.http.get<CompanyAccessList[]>(`${environment.apiUrl}companies/${idCompany}/accessCompanies/sellSide`);
  }

  getAccessCompaniesBuySide(idCompany: number | string): Observable<CompanyAccessList[]> {
    return this.http.get<CompanyAccessList[]>(`${environment.apiUrl}companies/${idCompany}/accessCompanies/buySide`);
  }

  addAccessCompanies(idCompany: number | string, idAccessCompany: number | string): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}companies/${idCompany}/accessCompanies/${idAccessCompany}`, {});
  }

  accessCompaniesAccept(idCompany: number | string, idAccessCompany: number | string): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}companies/${idCompany}/accessCompanies/${idAccessCompany}/accept`, {});
  }

  accessCompaniesRefuse(idCompany: number | string, idAccessCompany: number | string): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}companies/${idCompany}/accessCompanies/${idAccessCompany}/refuse`, {});
  }

  getCompanySalesRepresentant(idCompany: number | string): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(`${environment.apiUrl}companies/${idCompany}/accessCompanies/contacts`);
  }

  getCompanies(): Observable<CompanyModel[]> {
    return this.http.get<CompanyModel[]>(`${environment.apiUrl}companies`);
  }

  toggleCanSell(id: number | string, can_sell: boolean,sendMail=false): Observable<{ can_sell: boolean }> {
    return this.http.post<{ can_sell: boolean }>(`${environment.apiUrl}companies/${id}/cansell`, { can_sell,send_mail:sendMail });
  }

  getCompanyMembers(id?:number|string): Observable<AuthUser[]> {
    let idCompany = (id)?id:this.auth.getCompany().id;
    return this.http.get<AuthUser[]>(`${environment.apiUrl}companies/${idCompany}/users`);
  }

  getCompanySpaces(id?:number|string): Observable<SpaceModel[]> {
    let idCompany = (id)?id:this.auth.getCompany().id;
    return this.http.get<SpaceModel[]>(`${environment.apiUrl}companies/${idCompany}/spaces`);
  }

  getCompanyInfo(idCompany?: string | number): Observable<CompanyModel> {
    if (!idCompany) { idCompany = this.auth.getCompany().id; }
    return this.http.get<CompanyModel>(`${environment.apiUrl}companies/${idCompany}`);
  }

  updateCompany(companyUpdate: any): Observable<CompanyModel> {
    return this.http.post<CompanyModel>(`${environment.apiUrl}companies/${companyUpdate.uuid}`, companyUpdate);
  }

  saveCompanyChanges(updatedCompany: any): Observable<CompanyModel> {
    let idCompany = this.auth.getCompany().id;
    return this.http.post<CompanyModel>(`${environment.apiUrl}companies/${idCompany}`, updatedCompany);
  }

  inviteColleague(email: string, idCompany: number | string): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}companies/${idCompany}`, {email});
  }

  getHash(idCompany: number | string,temporalLink:boolean=true): Observable<string> {
    return this.http.put<any>(`${environment.apiUrl}companies/${idCompany}/accessCompanies/createHash`, {temporal:temporalLink});
  }

  getCompanyByHash(hash: string):Observable<CompanyModel>{
    return this.http.get<CompanyModel>(`${environment.apiUrl}companies/info/${hash}`);
  }

  acceptInvitation(idCompany: number | string, hash: string,inquiryId?:number|string): Observable<CompanyAccessList> {
    return this.http.put<CompanyAccessList>(`${environment.apiUrl}companies/${idCompany}/accessCompanies/acceptInvitationHash/${hash}`, {inquiry:inquiryId});
  }

  updateCompanyMember(newData:AuthUser):Observable<AuthUser>{
    let idCompany = this.auth.getCompany().id;
    return this.http.post<AuthUser>(`${environment.apiUrl}companies/${idCompany}/users`,newData);
  }
}

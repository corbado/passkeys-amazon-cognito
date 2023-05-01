import { CompanyModel } from '@corbado/models/company.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieOptions, CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { AuthUser } from '../auth-user';
import { ROLES } from 'src/app/enums';
import { Observable } from 'rxjs';
import { Author } from '@corbado/models/space.model';

const AUTH_COOKIE = 'corbado-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatorService {

  private user: AuthUser | any = null;
  private headersSkipAuth: HttpHeaders = new HttpHeaders().set('corbado-skipAuthToken', 'true');

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
    this.loadUserCookie();
  }

  public isAuth(): boolean {
    return this.user != null;
  }

  public getUser(): AuthUser {
    return this.user;
  }

  public setUser(newData: AuthUser): void {
    this.user = newData;
  }

  public getCompany():CompanyModel{
    return this.user.company;
  }

  public updateCompanySellStatus(val:boolean):void{
    this.user.company.can_sell = val;
    this.saveUserCookie()
  }

  public getRole(): number {
    return this.user?.role.id ?? 0;
  }

  public getUserUUID(): string | null {
    return this.user?.userID ?? null;
  }

  public getUserAsAuthor(): Author {
    return {
      id: this.user.id,
      name: this.user.fullname,
      picture: this.user.picture,
    }
  }

  public getAuthToken(): string | null {
    return this.user?.idToken ?? null;
  }

  public async logout(): Promise<void> {
    if (!this.user) return;
    this.deleteUserCookie();
    return this.handleRefreshToken(refreshTokenJob.Invalidate);
  }

  public async refreshAuthToken(forceRefresh?: boolean, skipExceededCheck?: boolean): Promise<void> {
    if (!this.user)
      throw new Error('cannot refresh auth token for not-logged in user');
    if (!this.user.expires) {
      this.clearUser();
      throw new Error('user invalid; logging out');
    }

    const minTimeToRefresh = (this.user.expires * 1000 - this.user.last_refresh) / 2 + this.user.last_refresh;
    if (skipExceededCheck || (!forceRefresh && minTimeToRefresh > Date.now())) return;

    return new Promise((resolve, reject) => {
      this.handleRefreshToken(refreshTokenJob.Refresh).then((data) => resolve(data)).catch((err) => {
        this.clearUser();
        reject(err);
      });
    });
  }

  public async authenticate(email: string, password: string): Promise<boolean> {
    if (!(email && password)) throw Error('Username and/or password not provided');
    const body = { email: email, password: password };
    const loggedInUser = await this.http.post<AuthUser>(`${environment.apiUrl}auth/login`, body, { headers: this.headersSkipAuth }).toPromise();
    this.user = loggedInUser;
    // @ts-ignore
    if (!loggedInUser.confirmed) {
      console.log('Email not confirmed');
      return false;
    }
    if (!loggedInUser?.idToken) throw new Error(`cannot fetch authentication token ${loggedInUser}!`);
    loggedInUser.last_refresh = +Date.now();
    this.saveUserCookie();
    return true;
  }

  public confirmEmail(email: string, code: string): Observable<any> {
    if (!(email && code)) {
      throw Error('Username and/or code not provided');
    }
    return this.http.post<any>(`${environment.apiUrl}auth/conf/${email}/${code}`, {}, { headers: this.headersSkipAuth });
  }

  public resendConfirmationEmail(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}auth/conf/${email}`, {}, { headers: this.headersSkipAuth });
  }

  public async registerLight(email: string, password: string): Promise<any> {
    if (!(email?.trim() && password?.trim())) {
      throw new Error('Missing input fields');
    }
    const body = { email: email, password: password, role: { name: ROLES.Admin } };
    const registrationResponse = await this.http.put(`${environment.apiUrl}users/registerLight`, body, { headers: this.headersSkipAuth }).toPromise();
    return registrationResponse;
  }

  private async handleRefreshToken(job: refreshTokenJob): Promise<void> {
    const body = {refreshToken: this.user.refreshToken};
    let route = 'refresh';
    if (job === refreshTokenJob.Invalidate) route = 'logout';
    const headersSkipAuthRefresh: HttpHeaders = new HttpHeaders().set('corbado-skipAuthTokenRefresh', 'true');
    const response = await this.http.post<AuthUser>(`${environment.apiUrl}auth/${route}`, body, { headers: headersSkipAuthRefresh }).toPromise();
    switch (job) {
      case refreshTokenJob.Refresh:
        if (!response?.idToken) throw new Error(`cannot fetch authentication token ${response}!`);
        this.user.last_refresh = +Date.now();
        this.user.idToken = response.idToken;
        break;
      case refreshTokenJob.Invalidate:
        this.user = null;
        await this.router.navigate(['auth']);
        break;
      default:
        throw Error('Invalid job type');
    }
    return;
  }

  private loadUserCookie() {
    let cookieValue = this.cookieService.getObject(AUTH_COOKIE);
    if (cookieValue) {
      let savedUser: AuthUser = cookieValue as AuthUser;
      if (savedUser.idToken) this.user = cookieValue;
    }
  }

  private saveUserCookie() {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const options: CookieOptions = { secure: environment.production, expires: expiryDate.toUTCString()};
    const cookie = JSON.parse(JSON.stringify(this.user));
    delete cookie.company;
    delete cookie.role;
    delete cookie.timestamp;
    delete cookie.confirmed;
    delete cookie.picture?.view_log;
    this.cookieService.putObject(AUTH_COOKIE, cookie, options);
  }

  private deleteUserCookie() {
    this.cookieService.remove(AUTH_COOKIE);
  }

  private clearUser() {
    this.deleteUserCookie();
    this.user = null;
    setTimeout(() => {
      this.router.navigate(['auth']);
    }, 500);
  }

  public getUserPictureUrl(): string{
    return this.user?.picture.url ?? null;
  }

  public getUserID(): string | number {
    return this.user?.id ?? null;
  }

  public isCurrentUser(id: number): boolean {
    if (this.user && this.user.id) return parseInt(this.user.id) === parseInt(id + '');
    else return false;
  }

  public sendPassResetCode(email:string):Observable<any>{
    return this.http.put(`${environment.apiUrl}auth/passwordReset`,{email});
  }

  public resetPassword(email:string,code:string,password:string):Observable<any>{
    return this.http.post(`${environment.apiUrl}auth/passwordReset`,{email,code,password});
  }

  public verifyEmailExistence(email:string):Observable<boolean>{
    return this.http.post<boolean>(`${environment.apiUrl}users/verifyMail`,{email});
  }
}

enum refreshTokenJob { Refresh, Invalidate }

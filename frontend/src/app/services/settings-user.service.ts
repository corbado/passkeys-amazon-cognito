import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser, RolModel } from '@corbado/auth/auth-user';
import { AuthService } from '@corbado/auth/services/auth.service';
import { Author } from '@corbado/models/space.model';
import { UserModel } from '@corbado/models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsUserService {

  currentUser!: AuthUser;

  constructor(private http: HttpClient, private auth: AuthService) {
    if (this.auth.isAuth()) this.getUser().subscribe((res: AuthUser) => this.currentUser = res);
  }

  getCurrentUser(): AuthUser {
    return this.currentUser;
  }

  getCookieStatus(): Observable<boolean> {
    let userId = this.auth.getUserID();
    return this.http.get<boolean>(`${environment.apiUrl}users/${userId}/cookie`);
  }

  setCookie(accepted: boolean): Observable<boolean> {
    let userId = this.auth.getUserID();
    return this.http.post<boolean>(`${environment.apiUrl}users/${userId}/cookie`, {accepted});
  }

  getCurrentUserModel(): UserModel {
    return {
      id: this.currentUser.id,
      fullname: this.currentUser.fullname,
      id_feeds: this.currentUser.id_feeds ? this.currentUser.id_feeds : [],
      email: this.currentUser.email,
      companies: [this.currentUser.company],
    };
  }

  setCurrentUser(newUserData: AuthUser) {
    this.currentUser = Object.assign(this.currentUser, newUserData);
  }

  findAll(): Observable<AuthUser[]>{
    return this.http.get<AuthUser[]>(`${environment.apiUrl}users`);
  }

  getUser(): Observable<AuthUser> {
    let userId = this.auth.getUserID();
    return this.http.get<AuthUser>(`${environment.apiUrl}users/${userId}`);
  }

  updateCurrentUser(): void {
    let userId = this.auth.getUserID();
    this.http.get<AuthUser>(`${environment.apiUrl}users/${userId}`).subscribe((user) => this.currentUser = user);
  }

  saveUserChanges(updatedUser: any, removedFeedID = 0): Observable<AuthUser> {
    let idUser = this.auth.getUserID();
    return this.http.post<AuthUser>(`${environment.apiUrl}users/${idUser}`, {update: updatedUser, removedFeedID: removedFeedID});
  }

  getRoles():Observable<RolModel[]> {
    return this.http.get<RolModel[]>(`${environment.apiUrl}users/roles`);
  }

  getCurrentUserAsAuthor(): Author {
    return {
      id: this.currentUser.id,
      name: this.currentUser.fullname,
      company: this.currentUser.company,
      position: this.currentUser.position,
    }
  }

  changeEmailNotifications(userId: number, notif: boolean): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}users/notif/${userId}`, {notif});
  }
}

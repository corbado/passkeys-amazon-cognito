import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private token: string = '';
  private userId: string = '';

  constructor(private http: HttpClient, private router: Router) {
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signUp(email: string, password: string): Observable<any> {
    const signUpData = {email: email, password: password};
    return this.http.post<{ message: string }>('http://localhost:3000/api/auth/signup', signUpData);
  }

  login(email: string, password: string): Observable<any> {
    const loginData = {email: email, password: password};
    return this.http.post<{ token: string, userId: string }>('http://localhost:3000/api/auth/login', loginData)
      .pipe(
        map(responseData => {
          const token = responseData.token;
          this.token = token;
          if (token) {
            const userId = responseData.userId;
            this.userId = userId;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/welcome']);
          }
        })
      );
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  async corbadoSessionVerify(corbadoSessionToken: string) {
    const sessionInfo = await this.http.get(`http://localhost:3000/api/corbado/sessionVerify?corbadoSessionToken=${corbadoSessionToken}`).toPromise();
    // if (!sessionInfo?.idToken) throw new Error(`cannot fetch authentication token ${loggedInUser}!`);
    // sessionInfo.last_refresh = +Date.now();
    return true;
  }

}

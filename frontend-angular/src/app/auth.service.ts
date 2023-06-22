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
    return this.http.post<{ token: string }>('http://localhost:3000/api/auth/login', loginData)
      .pipe(
        map(responseData => {
          const token = responseData.token;
          this.token = token;
          console.log(responseData)
          if (token) {
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/logged-in']);
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

  async corbadoAuthTokenValidate(corbadoAuthToken: string) {
    try {
      this.http.get<{ idToken: string }>(`http://localhost:3000/api/corbado/authTokenValidate?corbadoAuthToken=${corbadoAuthToken}`)
        .subscribe(responseData => {
          const token = responseData.idToken;
          this.token = token;
          if (token) {
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/logged-in']);
          }
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}

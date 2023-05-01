import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
/*
    Auth Token Service intercepts all http requests and adds the users auth token
    Set header corbado-skipAuthToken to skip bearer token adding
*/

export class AuthInterceptorService {
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.auth.isAuth() || request.headers.get('corbado-skipAuthToken') || request.url.startsWith('./'))
    {
      request = request.clone({ headers: request.headers.delete('corbado-skipAuthToken') });
      return next.handle(request);
    }
    if (request.headers.get('corbado-skipAuthTokenRefresh')) {
      request = request.clone({ headers: request.headers.delete('corbado-skipAuthTokenRefresh') });
      return from(this.addAuthToken(true, request, next));
    }
    return from(this.addAuthToken(false, request, next));
  }

  private async addAuthToken(skipRefresh: boolean, request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    if (!skipRefresh) await this.auth.refreshAuthToken();
    const bearer = this.auth.getAuthToken();
    if (bearer) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${bearer}` } });
    }
    return next.handle(request).toPromise();
  }
}

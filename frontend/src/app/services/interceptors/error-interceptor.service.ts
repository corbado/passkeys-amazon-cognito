import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(public notificationService: NotificationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method != "GET" && req.url != `${environment.apiUrl}auth/refresh` && !req.url.endsWith('view')) { // && !req.url.endsWith('view')
      this.notificationService.showNotification("Loading...", "loading");
    }
    return next.handle(req).pipe(
      catchError((error) => this.manageError(error))
    );
  }

  private manageError(error: HttpErrorResponse) {
    let message;
    switch (error.status) {
      case 400:
        message = "Oops. Das hat nicht geklappt. Bitte versuche es erneut";
        break;
      case 401:
        message = "Hmm. Leider konnten wir dich nicht anmelden. Versuch es bitte erneut";
        break;
      case 402:
        message = "Ihre Bewerbung hat keinen Inhalt";
        break;
      case 403:
        message = "Oje. Du bist anscheinend nicht berechtigt, den Inhalt anzusehen. Bitte kontaktiere Deinen Administrator";
        break;
      case 404:
        console.trace();
        message = "Seltsam, wir konnten nichts finden. Versuche es bitte erneut";
        break;
      case 413:
        message = "Oh, wie schön. Aber leider zu groß. Versuche es bitte erneut mit einer kleineren Datei";
        break;
      case 500:
        message = "Dieser Fehler geht auf uns - bitte versuche es erneut oder kontaktiere den hæppie Support";
        break;
      case 501:
        message = "Dieser Fehler geht auf uns - bitte versuche es erneut oder kontaktiere den hæppie Support";
        break;
      case 502:
        message = "Dieser Fehler geht auf uns - bitte versuche es erneut oder kontaktiere den hæppie Support";
        break;
      default:
        message = "Dieser Fehler geht auf uns - bitte versuche es erneut oder kontaktiere den hæppie Support";
        break;
    }
    message = error.error.message?error.error.message:message
    this.notificationService.showNotification(message, "warning");
    return throwError('An error has occurred');
  }
}

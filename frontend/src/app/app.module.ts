import { registerLocaleData } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { TranslocoRootModule } from './transloco/transloco-root.module';
import { LazyLoadImageModule, IntersectionObserverHooks, Attributes, LAZYLOAD_IMAGE_HOOKS } from 'ng-lazyload-image';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxHotjarModule, NgxHotjarRouterModule  } from 'ngx-hotjar';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { CoreModule } from './core/core.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AuthModule } from './auth/auth.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AppComponent } from './app.component';
import { SpacesComponent } from './pages/spaces/spaces.component';
import { TeamSpacesComponent } from './pages/team-spaces/team-spaces.component';
import { SpaceSelectorComponent } from './pages/space-selector/space-selector.component';
import { SpaceComponent } from './pages/space/space.component';
import { SpacePageComponent } from './pages/space-page/space-page.component';
import { PostComponent } from './pages/post/post.component';
import { ContentComponent } from './pages/content/content.component';
import { ContentTeamComponent } from './pages/content-team/content-team.component';
import { PopupComponent } from './pages/popup/popup.component';
import { SettingsNewComponent } from './pages/settings/settings-new.component';
import { CurrentTimeZonePipe } from './pipes/currentTimeZone.pipe';
import { ErrorInterceptorService } from './services/interceptors/error-interceptor.service';
import { AuthInterceptorService } from './auth/services/interceptor/auth-interceptor.service';
import { AuthenticatorService } from './auth/services/authenticator.service';
import { environment } from 'src/environments/environment';
import de from '@angular/common/locales/de';
import * as moment from 'moment';

registerLocaleData(de);
moment.locale("de");

@Injectable()
export class LazyLoadImageHooks extends IntersectionObserverHooks {

  constructor(private auth: AuthenticatorService) {
    super();
  }

  loadImage({ imagePath }: Attributes): Promise<string> {
    // if(!imagePath.includes(environment.apiUrl)){
    //   return fetch(imagePath).then((res)=>res.url);
    // }else{
      // return fetch(imagePath, {
      //   headers: {
      //    'Authorization':
      //   `Bearer ${this.authService.getAuthToken()}`
      //   },
      // })
      //   .then((res) => res.blob())
      //   .then((blob) => URL.createObjectURL(blob));
    // }
    return fetch(imagePath)
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));
  }
}

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: window.location.hostname
    // domain: 'localhost'
  },
  palette: {
    popup: {
      background: '#0E2F3E'
    },
    button: {
      background: '#fff'
    }
  },
  theme: 'classic',
  content: {
    message: 'We use cookies to personalize your site experience and analyze traffic.',
    allow: 'Accept  🤙',
    deny: '',
    link: 'Learn more',
    href: 'https://corbado.com/privacy-policy/',
    target: '_blank',
  },
  type: 'opt-out'
};

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    SpacesComponent,
    TeamSpacesComponent,
    SpaceSelectorComponent,
    SpaceComponent,
    SpacePageComponent,
    PostComponent,
    ContentComponent,
    ContentTeamComponent,
    PopupComponent,
    SettingsNewComponent,
    CurrentTimeZonePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslocoRootModule,
    SharedModule,
    DragDropModule,
    AuthModule,
    ColorPickerModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    NgxGoogleAnalyticsModule.forRoot(environment.gTagId),
    NgxGoogleAnalyticsRouterModule,
    NgxHotjarModule.forRoot(environment.hjid),
    NgxHotjarRouterModule,
    LazyLoadImageModule
  ],
  providers: [
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: LazyLoadImageHooks },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true,
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptorService,
        multi: true,
    },
    {
      provide:LOCALE_ID,
      useValue:'de'
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

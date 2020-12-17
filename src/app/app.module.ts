import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ENV } from '../environments/environment';

// Apollo
import { GraphQLModule } from './graphql.module';

import 'froala-editor/js/froala_editor.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

// Services
import { RoleGuardService } from './services/roleGuard.service';
import { UtilService } from './services/util.service';
import { RouterService } from './services/router.service';
import { DISQUS_SHORTNAME } from 'ngx-disqus';
import { AnalyticsService } from './services/analytics.service';
import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';
import { APIService } from './services/api.service';
import { ErrorService } from './services/error.service';
import { ExploreService } from './services/explore.service';
import { GeoService } from './services/geo.service';
import { JunctureService } from './services/juncture.service';
import { LocalStorageService } from './services/localStorage.service';
import { SettingsService } from './services/settings.service';
import { SplashGuardService } from './services/splashGuard.service';
import { TripService } from './services/trip.service';
import { AppService } from './services/app.service';
import { VisibilityService } from './services/visibility.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    GraphQLModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    // enhancing the ngsw http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/
    ServiceWorkerModule.register('/sw-master.js', { enabled: ENV.production }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    RoleGuardService,
    UtilService,
    RouterService,
    { provide: DISQUS_SHORTNAME, useValue: ENV.disqusShortname },
    AnalyticsService,
    UserService,
    AlertService,
    APIService,
    ErrorService,
    ExploreService,
    GeoService,
    JunctureService,
    LocalStorageService,
    SettingsService,
    SplashGuardService,
    TripService,
    AppService,
    VisibilityService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

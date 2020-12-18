import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ENV } from '../environments/environment';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';

// 3rd party modules
import { GraphQLModule } from './graphql.module';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AgmCoreModule } from '@agm/core';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import * as Cloudinary from 'cloudinary-core';

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

// components
// import { PageWrapperComponent } from './components/pageWrapper/pageWrapper.component';
// import { FooterComponent } from './components/footer/footer.component';
// import { NavBarComponent } from './components/navBar/navBar.component';
// import { CommunityNavSectionComponent } from './components/navBar/paneSections/community/communitySection.component';
// import { StoriesNavSectionComponent } from './components/navBar/paneSections/stories/storiesSection.component';
// import { MyPackNavSectionComponent } from './components/navBar/paneSections/myPack/myPackSection.component';
// import { RegistrationModalComponent } from './components/registrationModal/registrationModal';
// import { MobileNavModalComponent } from './components/mobileNavModal/mobileNavModal';
// import { HeroBannerComponent } from './components/heroBanner/heroBanner.component';

@NgModule({
  declarations: [
    AppComponent,
    // PageWrapperComponent,
    // FooterComponent,
    // NavBarComponent,
    // CommunityNavSectionComponent,
    // StoriesNavSectionComponent,
    // MyPackNavSectionComponent,
    // RegistrationModalComponent,
    // MobileNavModalComponent,
    // HeroBannerComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    GraphQLModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: ENV.googleAPIKey
    }),
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: ENV.cloudinaryCloudName } as CloudinaryConfiguration),
    // enhancing the ngsw http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/
    ServiceWorkerModule.register('/sw-master.js', { enabled: ENV.production }),
    ReactiveFormsModule,
    FormsModule,
    DirectivesModule,
    PipesModule
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
  exports: [
    // PageWrapperComponent,
    // FooterComponent,
    // NavBarComponent,
    // CommunityNavSectionComponent,
    // StoriesNavSectionComponent,
    // MyPackNavSectionComponent,
    // RegistrationModalComponent,
    // MobileNavModalComponent,
    // HeroBannerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

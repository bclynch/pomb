import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

// modules
import { JunctureModalModule } from '../modules/junctureModal/junctureModal.module';
import { TripModalModule } from '../modules/tripModal/tripModal.module';
import { GridModule } from '../modules/grid/grid.module';
import { NewsletterModule } from '../modules/newsletter/newsletter.module';
import { PostListModule } from '../modules/postList/postList.module';
import { TripCardModule } from '../modules/tripCard/tripCard.module';
import { ProfilePictureModule } from '../modules/profilePicture/profilePicture.module';
import { SearchModule } from '../modules/search/search.module';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';

// testing...
import { PageWrapperComponent } from '../components/pageWrapper/pageWrapper.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NavBarComponent } from '../components/navBar/navBar.component';
import { CommunityNavSectionComponent } from '../components/navBar/paneSections/community/communitySection.component';
import { StoriesNavSectionComponent } from '../components/navBar/paneSections/stories/storiesSection.component';
import { MyPackNavSectionComponent } from '../components/navBar/paneSections/myPack/myPackSection.component';
import { RegistrationModalComponent } from '../components/registrationModal/registrationModal';
import { MobileNavModalComponent } from '../components/mobileNavModal/mobileNavModal';
import { HeroBannerComponent } from '../components/heroBanner/heroBanner.component';
import { TrackIconComponent } from '../components/navBar/track/track.component';

@NgModule({
  declarations: [
    TrackIconComponent,
    PageWrapperComponent,
    FooterComponent,
    NavBarComponent,
    CommunityNavSectionComponent,
    StoriesNavSectionComponent,
    MyPackNavSectionComponent,
    RegistrationModalComponent,
    MobileNavModalComponent,
    HeroBannerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CloudinaryModule,
    JunctureModalModule,
    TripModalModule,
    GridModule,
    PostListModule,
    DirectivesModule,
    PipesModule,
    NewsletterModule,
    TripCardModule,
    ProfilePictureModule,
    SearchModule
  ],
  exports: [
    TrackIconComponent,
    PageWrapperComponent,
    FooterComponent,
    NavBarComponent,
    CommunityNavSectionComponent,
    StoriesNavSectionComponent,
    MyPackNavSectionComponent,
    RegistrationModalComponent,
    MobileNavModalComponent,
    HeroBannerComponent
  ],
  entryComponents: [
    RegistrationModalComponent,
    MobileNavModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { DisqusModule } from 'ngx-disqus';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

// components
import { FooterComponent } from './footer/footer.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GridComponent } from './grid/grid.component';
import { HeroBannerComponent } from './heroBanner/heroBanner.component';
import { NavBarComponent } from './navBar/navBar.component';
import { PageWrapperComponent } from './pageWrapper/pageWrapper.component';
import { ProfilePictureComponent } from './profilePicture/profilePicture.component';
import { UploadGPXComponent } from './uploadGPX/uploadGPX.component';
import { TrackUserComponent } from './trackUser/trackUser.component';
import { SearchComponent } from './search/search';
import { GalleryCardComponent } from './gallery/galleryCard/galleryCard.component';
import { GridCardComponent } from './grid/gridCard/gridCard.component';
import { CommunityNavSectionComponent } from './navBar/paneSections/community/communitySection.component';
import { StoriesNavSectionComponent } from './navBar/paneSections/stories/storiesSection.component';
import { MyPackNavSectionComponent } from './navBar/paneSections/myPack/myPackSection.component';
import { BackpackIconComponent } from './svgs/backpack/backpack.component';
import { TrackIconComponent } from './svgs/track/track.component';
import { TripCardComponent } from './tripCard/tripCard.component';
import { ExpandedModalComponent } from './gallery/expandedModal/expandedModal.component';
import { RegistrationModalComponent } from './registrationModal/registrationModal';
import { ExploreModalComponent } from './exploreModal/exploreModal';
import { MobileNavModalComponent } from './mobileNavModal/mobileNavModal';
import { GradientPopoverComponent } from './gradientPopover/gradientPopover.component';
import { DeleteAccountModalComponent } from './deleteAccountModal/deleteAccountModal';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { PostCardComponent } from './postCard/postCard.component';
import { LikeCounterComponent } from './likeCounter/likeCounter.component';
import { PostListComponent } from './postList/postList.component';
import { TagSearchComponent } from './tagSearch/tagSearch.component';
import { FadeCarouselComponent } from './fadeCarousel/fadeCarousel.component';
import { CommentsComponent } from './comments/comments.component';
import { GoogleChartComponent } from './charts/geoChart.component';
import { TagsComponent } from './tags/tags.component';

@NgModule({
  declarations: [
    FooterComponent,
    GalleryComponent,
    GridComponent,
    HeroBannerComponent,
    NavBarComponent,
    PageWrapperComponent,
    ProfilePictureComponent,
    UploadGPXComponent,
    TrackUserComponent,
    SearchComponent,
    GalleryCardComponent,
    GridCardComponent,
    CommunityNavSectionComponent,
    StoriesNavSectionComponent,
    MyPackNavSectionComponent,
    BackpackIconComponent,
    TripCardComponent,
    ExpandedModalComponent,
    RegistrationModalComponent,
    ExploreModalComponent,
    MobileNavModalComponent,
    GradientPopoverComponent,
    DeleteAccountModalComponent,
    NewsletterComponent,
    TrackIconComponent,
    PostCardComponent,
    LikeCounterComponent,
    PostListComponent,
    TagSearchComponent,
    FadeCarouselComponent,
    CommentsComponent,
    GoogleChartComponent,
    TagsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DirectivesModule,
    PipesModule,
    DisqusModule,
    CloudinaryModule
  ],
  exports: [
    FooterComponent,
    GalleryComponent,
    GridComponent,
    HeroBannerComponent,
    NavBarComponent,
    PageWrapperComponent,
    ProfilePictureComponent,
    UploadGPXComponent,
    TrackUserComponent,
    SearchComponent,
    GalleryCardComponent,
    GridCardComponent,
    CommunityNavSectionComponent,
    StoriesNavSectionComponent,
    MyPackNavSectionComponent,
    BackpackIconComponent,
    TripCardComponent,
    ExpandedModalComponent,
    RegistrationModalComponent,
    ExploreModalComponent,
    MobileNavModalComponent,
    GradientPopoverComponent,
    DeleteAccountModalComponent,
    NewsletterComponent,
    TrackIconComponent,
    PostCardComponent,
    LikeCounterComponent,
    PostListComponent,
    TagSearchComponent,
    FadeCarouselComponent,
    CommentsComponent,
    GoogleChartComponent,
    TagsComponent
  ],
  entryComponents: [
    RegistrationModalComponent,
    ExpandedModalComponent,
    ExploreModalComponent,
    MobileNavModalComponent,
    GradientPopoverComponent,
    DeleteAccountModalComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }

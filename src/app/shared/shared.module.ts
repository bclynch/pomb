import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { AgmCoreModule } from '@agm/core';
import { ENV } from '../../environments/environment';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { DisqusModule } from 'ngx-disqus';

// components
import { CompactHeroComponent } from './compactHero/compactHero.component';
import { FooterComponent } from './footer/footer.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GridComponent } from './grid/grid.component';
import { HeroBannerComponent } from './heroBanner/heroBanner.component';
import { NavBarComponent } from './navBar/navBar.component';
import { PageWrapperComponent } from './pageWrapper/pageWrapper.component';
import { ProfilePictureComponent } from './profilePicture/profilePicture.component';
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
import { CreatePostModalComponent } from './createPostModal/createPostModal';
import { ExploreModalComponent } from './exploreModal/exploreModal';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { JunctureBubblesComponent } from './junctureBubbles/junctureBubbles.component';
import { JunctureBubbleComponent } from './junctureBubbles/junctureBubble/junctureBubble.component';
import { PostCardComponent } from './postCard/postCard.component';
import { LikeCounterComponent } from './likeCounter/likeCounter.component';
import { PostListComponent } from './postList/postList.component';
import { GalleryImgActionPopoverComponent } from './galleryImgAction/galleryImgActionPopover.component';
import { TagSearchComponent } from './tagSearch/tagSearch.component';
import { PostWrapperComponent } from './postWrapper/postWrapper.component';
import { FadeCarouselComponent } from './fadeCarousel/fadeCarousel.component';
import { UnitToggleComponent } from './unitToggle/unitToggle.component';
import { ShareBtnsComponent } from './shareBtns/shareBtns.component';

@NgModule({
  declarations: [
    CompactHeroComponent,
    FooterComponent,
    GalleryComponent,
    GridComponent,
    HeroBannerComponent,
    NavBarComponent,
    PageWrapperComponent,
    ProfilePictureComponent,
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
    CreatePostModalComponent,
    ExploreModalComponent,
    NewsletterComponent,
    TrackIconComponent,
    JunctureBubblesComponent,
    JunctureBubbleComponent,
    PostCardComponent,
    LikeCounterComponent,
    PostListComponent,
    GalleryImgActionPopoverComponent,
    TagSearchComponent,
    PostWrapperComponent,
    FadeCarouselComponent,
    UnitToggleComponent,
    ShareBtnsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DirectivesModule,
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: ENV.googleAPIKey,
    }),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    DisqusModule
  ],
  exports: [
    CompactHeroComponent,
    FooterComponent,
    GalleryComponent,
    GridComponent,
    HeroBannerComponent,
    NavBarComponent,
    PageWrapperComponent,
    ProfilePictureComponent,
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
    CreatePostModalComponent,
    ExploreModalComponent,
    NewsletterComponent,
    TrackIconComponent,
    JunctureBubblesComponent,
    JunctureBubbleComponent,
    PostCardComponent,
    LikeCounterComponent,
    PostListComponent,
    GalleryImgActionPopoverComponent,
    TagSearchComponent,
    PostWrapperComponent,
    FadeCarouselComponent,
    UnitToggleComponent,
    ShareBtnsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }

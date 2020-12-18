import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripMapComponent } from './trip-map/trip-map.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { PipesModule } from '../../pipes/pipes.module';
import { ShareBtnsModule } from '../shareBtns/shareBtns.module';
import { GalleryModule } from '../gallery/gallery.module';
import { PostListModule } from '../postList/postList.module';
import { LikeCounterModule } from '../likeCounter/likeCounter.module';
import { ProfilePictureModule } from '../profilePicture/profilePicture.module';
import { TrackUserModule } from '../trackUser/trackUser.module';

const routes: Routes = [
  {
    path: '',
    component: TripMapComponent
  }
];

@NgModule({
  declarations: [
    TripMapComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    PipesModule,
    ShareBtnsModule,
    GalleryModule,
    PostListModule,
    LikeCounterModule,
    ProfilePictureModule,
    TrackUserModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TripMapModule { }

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripComponent } from './trip/trip.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FroalaViewModule } from 'angular-froala-wysiwyg';
import { DisqusModule } from 'ngx-disqus';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { MapSectionComponent } from './sections/map/map.component';
import { DirectivesModule } from '../../directives/directives.module';
import { JunctureBubblesModule } from '../junctureBubbles/junctureBubbles.module';
import { GalleryModule } from '../gallery/gallery.module';
import { PostListModule } from '../postList/postList.module';
import { FadeCarouselModule } from '../fadeCarousel/fadeCarousel.module';
import { ProfilePictureModule } from '../profilePicture/profilePicture.module';
import { CommentsModule } from '../comments/comments.module';
import { TrackUserModule } from '../trackUser/trackUser.module';

const routes: Routes = [
  {
    path: ':tripId',
    children: [
      {
        path: '',
        component: TripComponent
      },
      {
        path: 'map',
        loadChildren: () => import('../trip-map/trip-map.module').then(m => m.TripMapModule)
      },
      {
        path: 'posts',
        loadChildren: () => import('../hub/hub.module').then(m => m.HubModule)
      },
      {
        path: 'junctures',
        loadChildren: () => import('../trip-timeline/trip-timeline.module').then(m => m.TripTimelineModule)
      },
      {
        path: 'photos',
        loadChildren: () => import('../photos/photos.module').then(m => m.PhotosModule)
      },
    ]
  }
];

@NgModule({
  declarations: [
    TripComponent,
    MapSectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FroalaViewModule,
    DisqusModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    DirectivesModule,
    JunctureBubblesModule,
    GalleryModule,
    PostListModule,
    FadeCarouselModule,
    ProfilePictureModule,
    CommentsModule,
    TrackUserModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TripModule { }

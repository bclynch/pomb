import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreComponent } from './explore/explore.component';
import { ExploreRegionPage } from './region/explore.region';
import { ExploreCountryPage } from './country/explore.country';
import { ExploreCityPage } from './city/explore.city';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ExploreSubnavComponent } from './exploreSubnav/exploreSubnav.component';
import { PlaceGuideComponent } from './placeGuide/placeGuide.component';
import { FadeCarouselModule } from '../fadeCarousel/fadeCarousel.module';
import { GeoChartModule } from '../geoChart/geoChart.module';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { ExploreModalComponent } from './exploreModal/exploreModal';

const routes: Routes = [
  { path: '',
    children: [
      {
        path: 'region',
        children: [
          {
            path: ':region',
            children: [
              {
                path: '',
                component: ExploreRegionPage
              },
              {
                path: ':subregion',
                component: ExploreRegionPage
              }
            ]
          },
          {
            path: '',
            component: ExploreComponent
          }
        ]
      },
      {
        path: 'country',
        children: [
          {
            path: ':country',
            children: [
              {
                path: ':city',
                component: ExploreCityPage
              },
              {
                path: '',
                component: ExploreCountryPage
              }
            ]
          },
          {
            path: '',
            component: ExploreComponent
          }
        ]
      },
      {
        path: '',
        component: ExploreComponent
      }
  ]},
];

@NgModule({
  declarations: [
    ExploreComponent,
    ExploreRegionPage,
    ExploreCountryPage,
    ExploreCityPage,
    ExploreSubnavComponent,
    PlaceGuideComponent,
    ExploreModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FadeCarouselModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    GeoChartModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExploreModule { }

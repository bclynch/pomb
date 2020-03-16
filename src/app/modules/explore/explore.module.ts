import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreComponent } from './explore/explore.component';
import { ExploreRegionPage } from './region/explore.region';
import { ExploreCountryPage } from './country/explore.country';
import { ExploreCityPage } from './city/explore.city';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

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
  declarations: [ExploreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ExploreModule { }

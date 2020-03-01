import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripTimelineComponent } from './trip-timeline/trip-timeline.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TripTimelineComponent
  }
];

@NgModule({
  declarations: [TripTimelineComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class TripTimelineModule { }

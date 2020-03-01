import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripMapComponent } from './trip-map/trip-map.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TripMapComponent
  }
];

@NgModule({
  declarations: [TripMapComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class TripMapModule { }

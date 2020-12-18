import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingComponent } from './tracking/tracking.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RoleGuardService as RoleGuard } from '../../services/roleGuard.service';
import { TripCardModule } from '../tripCard/tripCard.module';
import { ProfilePictureModule } from '../profilePicture/profilePicture.module';

const routes: Routes = [
  {
    path: '',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['pomb_account', 'pomb_admin']
    },
    component: TrackingComponent
  }
];

@NgModule({
  declarations: [TrackingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TripCardModule,
    ProfilePictureModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrackingModule { }

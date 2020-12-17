import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAdminPage } from './admin';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RoleGuardService as RoleGuard } from '../../services/roleGuard.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CountrySearchComponent } from '../../components/countrySearch/countrySearch.component';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';

import { UserAdminDashboardPage } from './subViews/dashboard/dashboard';
import { UserAdminConfigPage } from './subViews/config/config';
import { UserAdminTripsPage } from './subViews/trips/trips';
import { UserAdminSettingsPage } from './subViews/settings/settings';

const routes: Routes = [
  {
    path: '',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['pomb_account', 'pomb_admin']
    },
    component: UserAdminPage
  },
];

@NgModule({
  declarations: [
    UserAdminPage,
    UserAdminConfigPage,
    UserAdminDashboardPage,
    UserAdminSettingsPage,
    UserAdminTripsPage,
    CountrySearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ImageUploaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserAdminModule { }

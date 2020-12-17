import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RoleGuardService as RoleGuard } from '../../services/roleGuard.service';
import { ENV } from '../../../environments/environment';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import * as Cloudinary from 'cloudinary-core';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'admin',
        canActivate: [RoleGuard],
        data: {
          expectedRole: ['pomb_account', 'pomb_admin']
        },
        loadChildren: () => import('../userAdmin/user-admin.module').then(m => m.UserAdminModule)
      },
      {
        path: 'post-dashboard',
        canActivate: [RoleGuard],
        data: {
          expectedRole: ['pomb_account', 'pomb_admin']
        },
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: ':username',
        children: [
          {
            path: '',
            component: ProfileComponent
          },
          {
            path: 'photos',
            loadChildren: () => import('../photos/photos.module').then(m => m.PhotosModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: ENV.cloudinaryCloudName } as CloudinaryConfiguration)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileModule { }

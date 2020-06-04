import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAdminPage } from './admin';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RoleGuardService as RoleGuard } from '../../services/roleGuard.service';

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
        component: UserAdminPage
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
            loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule)
          },
          {
            path: 'photos',
            loadChildren: () => import('../photos/photos.module').then(m => m.PhotosModule)
          }
        ]
      },
    ]
  },
];

@NgModule({
  declarations: [UserAdminPage],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserAdminModule { }

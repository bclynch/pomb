import { NgModule } from '@angular/core';
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
        component: DashboardPage
      },
      {
        path: ':username',
        children: [
          {
            path: '',
            component: ProfilePage
          },
          {
            path: 'photos',
            component: PhotosPage
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
  ]
})
export class UserAdminModule { }

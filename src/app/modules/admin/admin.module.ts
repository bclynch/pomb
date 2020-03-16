import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPage } from './admin';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RoleGuardService as RoleGuard } from '../../services/roleGuard.service';

const routes: Routes = [
  { path: '',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['pomb_admin']
    },
    children: [
      {
        path: '',
        component: AdminPage
      },
      {
        path: ':id',
        children: [
          {
              path: 'dashboard',
              component: AdminPage
          },
          {
              path: 'config',
              component: AdminPage
          },
          {
              path: 'users',
              component: AdminPage
          },
          {
              path: 'posts',
              component: AdminPage
          }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [AdminPage],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AdminModule { }

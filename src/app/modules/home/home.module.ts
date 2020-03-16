import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PostComponent } from '../post/post/post.component';
import { HubComponent } from '../hub/hub/hub.component';

const routes: Routes = [
  {
    path: 'stories',
    children: [
      {
        path: 'post',
        children: [
          {
            path: ':id',
            children: [
              {
                path: ':title',
                component: PostComponent
              }
            ]
          }
        ]
      },
      {
        path: ':tag',
        children: [
          {
            path: '',
            component: HubComponent
          }
        ]
      },
      {
        path: '',
        component: HomeComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    PostComponent,
    HubComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HomeModule { }

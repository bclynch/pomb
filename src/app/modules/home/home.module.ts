import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PostComponent } from '../post/post/post.component';
import { PipesModule } from '../../pipes/pipes.module';

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
            loadChildren: () => import('../hub/hub.module').then(m => m.HubModule)
          }
        ]
      },
      {
        path: '',
        component: HomeComponent
      }
    ]
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PipesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule { }

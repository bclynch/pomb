import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../pipes/pipes.module';
import { CompactHeroComponent } from './compactHero/compactHero.component';
import { GridModule } from '../grid/grid.module';
import { PostListModule } from '../postList/postList.module';
import { TripCardModule } from '../tripCard/tripCard.module';

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
                loadChildren: () => import('../post/post.module').then(m => m.PostModule)
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
    CompactHeroComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PipesModule,
    GridModule,
    PostListModule,
    TripCardModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule { }

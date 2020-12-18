import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { Routes, RouterModule } from '@angular/router';
import { PostWrapperModule } from '../postWrapper/postWrapper.module';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PostComponent
  }
];

@NgModule({
  declarations: [
    PostComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PostWrapperModule,
    SharedModule
  ]
})
export class PostModule { }

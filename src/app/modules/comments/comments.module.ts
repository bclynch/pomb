import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments/comments.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { DisqusModule } from 'ngx-disqus';

@NgModule({
  declarations: [
    CommentsComponent
  ],
  imports: [
    CommonModule,
    CloudinaryModule,
    DisqusModule
  ],
  exports: [CommentsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommentsModule { }

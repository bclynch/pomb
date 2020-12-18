import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from './postList/postList.component';
import { PostCardComponent } from './postList/postCard/postCard.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { PipesModule } from '../../pipes/pipes.module';
import { NewsletterModule } from '../newsletter/newsletter.module';

@NgModule({
  declarations: [
    PostListComponent,
    PostCardComponent
  ],
  imports: [
    CommonModule,
    CloudinaryModule,
    PipesModule,
    NewsletterModule
  ],
  exports: [PostListComponent, PostCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostListModule { }

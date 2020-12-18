import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostWrapperComponent } from './postWrapper/postWrapper.component';
import { FroalaViewModule } from 'angular-froala-wysiwyg';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { GalleryModule } from '../gallery/gallery.module';
import { PostListModule } from '../postList/postList.module';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { LikeCounterModule } from '../likeCounter/likeCounter.module';
import { CommentsModule } from '../comments/comments.module';
import { TrackUserModule } from '../trackUser/trackUser.module';
import { ShareBtnsModule } from '../shareBtns/shareBtns.module';
import { TagsComponent } from './postWrapper/tags/tags.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PostWrapperComponent,
    TagsComponent
  ],
  imports: [
    CommonModule,
    FroalaViewModule,
    CloudinaryModule,
    GalleryModule,
    PostListModule,
    SharedModule,
    NewsletterModule,
    LikeCounterModule,
    CommentsModule,
    TrackUserModule,
    ShareBtnsModule
  ],
  exports: [PostWrapperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostWrapperModule { }

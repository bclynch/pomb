import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery/gallery.component';
import { ExpandedModalComponent } from './gallery/expandedModal/expandedModal.component';
import { GalleryCardComponent } from './gallery/galleryCard/galleryCard.component';
import { LikeCounterModule } from '../likeCounter/likeCounter.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

@NgModule({
  declarations: [
    GalleryComponent,
    ExpandedModalComponent,
    GalleryCardComponent
  ],
  imports: [
    CommonModule,
    LikeCounterModule,
    CloudinaryModule
  ],
  exports: [GalleryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GalleryModule { }

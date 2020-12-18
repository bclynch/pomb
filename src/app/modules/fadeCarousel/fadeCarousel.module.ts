import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeCarouselComponent } from './fadeCarousel/fadeCarousel.component';
import { LikeCounterModule } from '../likeCounter/likeCounter.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

@NgModule({
  declarations: [
    FadeCarouselComponent
  ],
  imports: [
    CommonModule,
    LikeCounterModule,
    CloudinaryModule
  ],
  exports: [FadeCarouselComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FadeCarouselModule { }

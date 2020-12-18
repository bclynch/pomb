import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikeCounterComponent } from './likeCounter/likeCounter.component';

@NgModule({
  declarations: [
    LikeCounterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [LikeCounterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LikeCounterModule { }

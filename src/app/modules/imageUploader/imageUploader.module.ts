import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderPopoverComponent } from './imageUploader/imageUploaderPopover.component';

@NgModule({
  declarations: [ImageUploaderPopoverComponent],
  imports: [
    CommonModule
  ],
  exports: [ImageUploaderPopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageUploaderModule { }

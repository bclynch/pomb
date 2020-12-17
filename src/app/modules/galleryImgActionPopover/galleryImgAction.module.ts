import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryImgActionPopoverComponent } from './galleryImgAction/galleryImgActionPopover.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GalleryImgActionPopoverComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [GalleryImgActionPopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GalleryImgActionPopoverModule { }

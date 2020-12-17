import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripModalComponent } from './tripModal/tripModal';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { DatepickerModalModule } from '../datepickerModal/datepickerModal.module';
import { GalleryImgActionPopoverModule } from '../galleryImgActionPopover/galleryImgAction.module';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [TripModalComponent],
  imports: [
    CommonModule,
    ImageUploaderModule,
    DatepickerModalModule,
    GalleryImgActionPopoverModule,
    FroalaEditorModule,
    AgmCoreModule
  ],
  exports: [TripModalComponent],
  entryComponents: [
    TripModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TripModalModule { }

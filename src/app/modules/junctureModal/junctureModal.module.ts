import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JunctureModalComponent } from './junctureModal/junctureModal';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { DatepickerModalModule } from '../datepickerModal/datepickerModal.module';
import { GalleryImgActionPopoverModule } from '../galleryImgActionPopover/galleryImgAction.module';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { AgmCoreModule } from '@agm/core';
import { ENV } from '../../../environments/environment';

@NgModule({
  declarations: [JunctureModalComponent],
  imports: [
    CommonModule,
    ImageUploaderModule,
    DatepickerModalModule,
    GalleryImgActionPopoverModule,
    FroalaEditorModule,
    AgmCoreModule
  ],
  exports: [JunctureModalComponent],
  entryComponents: [
    JunctureModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JunctureModalModule { }

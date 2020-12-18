import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JunctureModalComponent } from './junctureModal/junctureModal';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { DatepickerModalModule } from '../datepickerModal/datepickerModal.module';
import { GalleryImgActionPopoverModule } from '../galleryImgActionPopover/galleryImgAction.module';
import { JunctureSaveTypePopoverComponent } from './junctureSaveType/junctureSaveTypePopover.component';
import { UploadGPXComponent } from './uploadGPX/uploadGPX.component';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    JunctureModalComponent,
    JunctureSaveTypePopoverComponent,
    UploadGPXComponent
  ],
  imports: [
    CommonModule,
    ImageUploaderModule,
    DatepickerModalModule,
    GalleryImgActionPopoverModule,
    FroalaEditorModule,
    AgmCoreModule,
    FormsModule
  ],
  exports: [JunctureModalComponent],
  entryComponents: [
    JunctureModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JunctureModalModule { }

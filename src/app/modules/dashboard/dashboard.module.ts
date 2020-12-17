import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardCardComponent } from './dashboardCard/dashboardCard.component';
import { PostWrapperModule } from '../postWrapper/postWrapper.module';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { CreatePostModalComponent } from '../../components/createPostModal/createPostModal';
import { PostTypePopoverComponent } from '../../components/postType/postTypePopover.component';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { DatepickerModalModule } from '../datepickerModal/datepickerModal.module';
import { GalleryImgActionPopoverModule } from '../galleryImgActionPopover/galleryImgAction.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardCardComponent,
    CreatePostModalComponent,
    PostTypePopoverComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FroalaEditorModule,
    ImageUploaderModule,
    DatepickerModalModule,
    GalleryImgActionPopoverModule,
    ReactiveFormsModule,
    FormsModule,
    AgmCoreModule,
    PostWrapperModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }

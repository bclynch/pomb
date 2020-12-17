import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostWrapperComponent } from './postWrapper/postWrapper.component';
// import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
// import { ShareIconsModule } from 'ngx-sharebuttons/icons';
// import { ShareBtnsComponent } from '../../components/shareBtns/shareBtns.component';
import { FroalaViewModule } from 'angular-froala-wysiwyg';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

@NgModule({
  declarations: [
    PostWrapperComponent
  ],
  imports: [
    CommonModule,
    // ShareButtonsModule,
    // ShareIconsModule
    FroalaViewModule,
    CloudinaryModule
  ],
  exports: [PostWrapperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostWrapperModule { }

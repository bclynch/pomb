import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareBtnsComponent } from './shareBtns/shareBtns.component';

@NgModule({
  declarations: [
    ShareBtnsComponent
  ],
  imports: [
    CommonModule,
    ShareButtonsModule,
    ShareIconsModule
  ],
  exports: [ShareBtnsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShareBtnsModule { }

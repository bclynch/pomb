import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserComponent } from './trackUser/trackUser.component';

@NgModule({
  declarations: [
    TrackUserComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [TrackUserComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrackUserModule { }

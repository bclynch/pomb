import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JunctureBubblesComponent } from './junctureBubbles/junctureBubbles.component';
import { JunctureBubbleComponent } from './junctureBubbles/junctureBubble/junctureBubble.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

@NgModule({
  declarations: [JunctureBubblesComponent, JunctureBubbleComponent],
  imports: [
    CommonModule,
    CloudinaryModule
  ],
  exports: [JunctureBubblesComponent, JunctureBubbleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JunctureBubblesModule { }

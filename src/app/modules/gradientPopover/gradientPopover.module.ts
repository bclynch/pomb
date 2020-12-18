import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradientPopoverComponent } from './gradientPopover/gradientPopover.component';

@NgModule({
  declarations: [
    GradientPopoverComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [GradientPopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GradientPopoverModule { }

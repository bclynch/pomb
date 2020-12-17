import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowScrollDirective } from './scroll.directive';
import { EqualValidator } from './validatePassword.directive';
import { VisibleWith } from './visible-with.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [WindowScrollDirective, EqualValidator, VisibleWith],
  exports: [WindowScrollDirective, EqualValidator, VisibleWith]
})
export class DirectivesModule { }

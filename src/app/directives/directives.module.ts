import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowScrollDirective } from './scroll.directive';
import { EqualValidator } from './validatePassword.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [WindowScrollDirective, EqualValidator],
  exports: [WindowScrollDirective, EqualValidator]
})
export class DirectivesModule { }

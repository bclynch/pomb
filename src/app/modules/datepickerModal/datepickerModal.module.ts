import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerModalComponent } from './datepickerModal/datepickerModal';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DatePickerModalComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [DatePickerModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DatepickerModalModule { }

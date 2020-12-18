import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCardComponent } from './tripCard/tripCard.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

@NgModule({
  declarations: [
    TripCardComponent
  ],
  imports: [
    CommonModule,
    CloudinaryModule
  ],
  exports: [TripCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TripCardModule { }

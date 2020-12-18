import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid/grid.component';
import { GridCardComponent } from './grid/gridCard/gridCard.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

@NgModule({
  declarations: [
    GridComponent,
    GridCardComponent
  ],
  imports: [
    CommonModule,
    CloudinaryModule
  ],
  exports: [GridComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GridModule { }

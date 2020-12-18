import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleChartComponent } from './geoChart/geoChart.component';

@NgModule({
  declarations: [
    GoogleChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [GoogleChartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GeoChartModule { }

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripMapComponent } from './trip-map/trip-map.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { PipesModule } from '../../pipes/pipes.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareBtnsComponent } from '../../components/shareBtns/shareBtns.component';

const routes: Routes = [
  {
    path: '',
    component: TripMapComponent
  }
];

@NgModule({
  declarations: [
    TripMapComponent,
    ShareBtnsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    PipesModule,
    ShareButtonsModule,
    ShareIconsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TripMapModule { }

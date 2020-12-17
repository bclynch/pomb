import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JunctureComponent } from './juncture/juncture.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { DisqusModule } from 'ngx-disqus';
import { FroalaViewModule } from 'angular-froala-wysiwyg';
import { ChartComponent } from '../../components/chart/chart.component';
import { UnitToggleComponent } from '../../components/unitToggle/unitToggle.component';

const routes: Routes = [
  {
    path: ':junctureId',
    component: JunctureComponent
  }
];

@NgModule({
  declarations: [
    JunctureComponent,
    ChartComponent,
    UnitToggleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FroalaViewModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    DisqusModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JunctureModule { }

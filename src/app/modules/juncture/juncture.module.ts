import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JunctureComponent } from './juncture/juncture.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { ENV } from '../../../environments/environment';
import { DisqusModule } from 'ngx-disqus';
import { FroalaViewModule } from 'angular-froala-wysiwyg';

const routes: Routes = [
  {
    path: ':junctureId',
    component: JunctureComponent
  }
];

@NgModule({
  declarations: [JunctureComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FroalaViewModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: ENV.googleAPIKey,
    }),
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    DisqusModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JunctureModule { }

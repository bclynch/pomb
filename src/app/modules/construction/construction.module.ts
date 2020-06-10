import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstructionComponent } from './construction/construction.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ConstructionComponent
  }
];

@NgModule({
  declarations: [ConstructionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConstructionModule { }

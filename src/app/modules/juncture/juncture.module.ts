import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JunctureComponent } from './juncture/juncture.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: JunctureComponent
  }
];

@NgModule({
  declarations: [JunctureComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class JunctureModule { }

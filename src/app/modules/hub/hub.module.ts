import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubComponent } from './hub/hub.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { GridModule } from '../grid/grid.module';
import { PostListModule } from '../postList/postList.module';

const routes: Routes = [
  {
    path: '',
    component: HubComponent
  }
];

@NgModule({
  declarations: [HubComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    GridModule,
    PostListModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HubModule { }

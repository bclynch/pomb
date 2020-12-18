import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveComponent } from './archive/archive.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { GridModule } from '../grid/grid.module';
import { PostListModule } from '../postList/postList.module';

const routes: Routes = [
  {
    path: ':page',
    component: ArchiveComponent
  },
  {
    path: '',
    component: ArchiveComponent
  }
];

@NgModule({
  declarations: [ArchiveComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    GridModule,
    PostListModule
  ]
})
export class ArchiveModule { }

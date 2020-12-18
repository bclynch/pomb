import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProfilePictureModule } from '../profilePicture/profilePicture.module';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  }
];

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ProfilePictureModule
  ]
})
export class AboutModule { }

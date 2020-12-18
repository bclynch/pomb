import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePictureComponent } from './profilePicture/profilePicture.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { BackpackIconComponent } from './backpack/backpack.component';
import { TrackUserModule } from '../trackUser/trackUser.module';

@NgModule({
  declarations: [
    ProfilePictureComponent,
    BackpackIconComponent
  ],
  imports: [
    CommonModule,
    CloudinaryModule,
    TrackUserModule
  ],
  exports: [ProfilePictureComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfilePictureModule { }

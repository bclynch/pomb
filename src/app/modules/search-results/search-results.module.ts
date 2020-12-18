import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from './search-results/search-results.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PostListModule } from '../postList/postList.module';
import { ProfilePictureModule } from '../profilePicture/profilePicture.module';
import { SearchModule } from '../search/search.module';

const routes: Routes = [
  {
    path: '',
    component: SearchResultsComponent
  }
];

@NgModule({
  declarations: [SearchResultsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PostListModule,
    ProfilePictureModule,
    SearchModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchResultsModule { }

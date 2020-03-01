import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./modules/about/about.module').then( m => m.AboutModule)
  },
  {
    path: 'archive',
    loadChildren: () => import('./modules/archive/archive.module').then( m => m.ArchiveModule)
  },
  {
    path: 'community',
    loadChildren: () => import('./modules/community/community.module').then( m => m.CommunityModule)
  },
  {
    path: 'construction',
    loadChildren: () => import('./modules/construction/construction.module').then( m => m.ConstructionModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./modules/contact/contact.module').then( m => m.ContactModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./modules/error/error.module').then( m => m.ErrorModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./modules/favorites/favorites.module').then( m => m.FavoritesModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./modules/search-results/search-results.module').then( m => m.SearchResultsModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./modules/reset/reset.module').then( m => m.ResetModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./modules/terms/terms.module').then( m => m.TermsModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

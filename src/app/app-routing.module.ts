import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./modules/splash/splash.module').then(m => m.SplashModule),
  // },
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
    path: 'stories',
    loadChildren: () => import('./modules/home/home.module').then( m => m.HomeModule)
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
  },
  {
    path: 'trip',
    loadChildren: () => import('./modules/trip/trip.module').then( m => m.TripModule)
  },
  {
    path: 'juncture',
    loadChildren: () => import('./modules/juncture/juncture.module').then( m => m.JunctureModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/profile/profile.module').then( m => m.ProfileModule)
  },
  {
    path: 'admin-login',
    loadChildren: () => import('./modules/admin-login/admin-login.module').then( m => m.AdminLoginModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then( m => m.AdminModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./modules/tracking/tracking.module').then( m => m.TrackingModule)
  },
  {
    path: 'explore',
    loadChildren: () => import('./modules/explore/explore.module').then( m => m.ExploreModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

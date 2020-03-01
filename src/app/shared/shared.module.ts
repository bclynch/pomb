import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';

// components
import { CompactHero } from './compactHero/compactHero.component';
import { Footer } from './footer/footer.component';
import { Gallery } from './gallery/gallery.component';
import { Grid } from './grid/grid.component';
import { HeroBanner } from './heroBanner/heroBanner.component';
import { NavBar } from './navBar/navBar.component';
import { PageWrapper } from './pageWrapper/pageWrapper.component';

@NgModule({
  declarations: [
    CompactHero,
    Footer,
    Gallery,
    Grid,
    HeroBanner,
    NavBar,
    PageWrapper
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DirectivesModule,
    PipesModule
  ],
  exports: [
    CompactHero,
    Footer,
    Gallery,
    Grid,
    HeroBanner,
    NavBar,
    PageWrapper
  ]
})
export class SharedModule { }

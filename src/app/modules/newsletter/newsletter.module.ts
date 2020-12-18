import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NewsletterComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [NewsletterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewsletterModule { }

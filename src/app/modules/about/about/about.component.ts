import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from '../../../services/settings.service';
import { AppService } from 'src/app/services/app.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnDestroy {

  contactModel = { why: null, name: '', email: '', content: '' };

  whyOptions: { label: string; value: string; }[] = [
    { label: 'I need technical support / I found a bug', value: 'support' },
    { label: 'I need help figuring out how something works', value: 'question' },
    { label: 'Other', value: 'other' }
  ];

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    public sanitizer: DomSanitizer,
    private appService: AppService
  ) {
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.init();
        }
      }
    );
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  init() {
    this.settingsService.modPageMeta(
      'About',
      'Pack On My Back is software platform intended to take the pain out of archiving your memories.'
    );
  }
}

import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from '../../../services/settings.service';
import { BroadcastService } from '../../../services/broadcast.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  contactModel = { why: null, name: '', email: '', content: '' };

  whyOptions: { label: string; value: string; }[] = [
    { label: 'I need technical support / I found a bug', value: 'support' },
    { label: 'I need help figuring out how something works', value: 'question' },
    { label: 'Other', value: 'other' }
  ];

  constructor(
    public settingsService: SettingsService,
    private broadcastService: BroadcastService,
    public sanitizer: DomSanitizer
  ) {
    this.settingsService.appInited ? this.init() : this.broadcastService.on('appIsReady', () => this.init());
  }

  init() {
    this.settingsService.modPageMeta(
      'About',
      'Pack On My Back is software platform intended to take the pain out of archiving your memories.'
    );
  }
}

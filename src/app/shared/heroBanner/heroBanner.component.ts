import { Component } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './heroBanner.component.html',
  styleUrls: ['./heroBanner.component.scss']
})
export class HeroBannerComponent {
  today: number = Date.now();
  defaultBannerImg = 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-bridalveil-winter-1200x800.jpg';

  constructor(
    public settingsService: SettingsService
  ) { }

}

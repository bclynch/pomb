import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './heroBanner.component.html',
  styleUrls: ['./heroBanner.component.scss']
})
export class HeroBannerComponent {

  today: number = Date.now();

  constructor(
    public settingsService: SettingsService
  ) { }

}

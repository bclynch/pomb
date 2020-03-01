import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-hero-banner',
  templateUrl: 'heroBanner.component.html'
})
export class HeroBanner {

  today: number = Date.now();

  constructor(
    private settingsService: SettingsService
  ) { }

}

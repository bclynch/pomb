import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-profile-hero-banner',
  templateUrl: 'profileHeroBanner.component.html',
  styleUrls: ['./profileHeroBanner.component.scss']
})
export class ProfileHeroBannerComponent {
  @Input() user;

  defaultBannerImg = 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-bridalveil-winter-1200x800.jpg';

  constructor(
    public userService: UserService,
    public sanitizer: DomSanitizer,
    public settingsService: SettingsService,
    private routerService: RouterService
  ) { }

  navigateToSettings() {
    this.routerService.modifyFragment('config', 'user/admin');
  }
}

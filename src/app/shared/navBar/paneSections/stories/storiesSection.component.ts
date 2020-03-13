import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';

@Component({
  selector: 'app-stories-nav-section',
  templateUrl: 'storiesSection.component.html',
  styleUrls: ['./storiesSection.component.scss']
})
export class StoriesNavSectionComponent {

  constructor(
    public settingsService: SettingsService,
    public routerService: RouterService,
    public sanitizer: DomSanitizer
  ) {}

  navigateToPost(story) {
    this.routerService.navigateToPage(`/stories/post/${story.id}/${story.title.split(' ').join('-')}`);
  }
}

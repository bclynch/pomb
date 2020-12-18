import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';
import { UtilService } from '../../../../services/util.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './postCard.component.html',
  styleUrls: ['./postCard.component.scss']
})
export class PostCardComponent {
  @Input() data;
  @Input() displayAuthor = true;
  @Input() displayImage = true;
  @Input() displayDescription = false;

  constructor(
    public settingsService: SettingsService,
    public routerService: RouterService,
    public sanitizer: DomSanitizer,
    public utilService: UtilService
  ) {

  }

  navigateToPost() {
    this.routerService.navigateToPage(`/stories/post/${this.data.id}/${this.data.title.split(' ').join('-')}`);
  }
}

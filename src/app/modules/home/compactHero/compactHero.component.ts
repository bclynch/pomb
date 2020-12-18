import { Component, Input } from '@angular/core';

import { SettingsService } from '../../../services/settings.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-compact-hero',
  templateUrl: './compactHero.component.html',
  styleUrls: ['./compactHero.component.scss']
})
export class CompactHeroComponent {
  @Input() post;

  constructor(
    public settingsService: SettingsService,
    private routerService: RouterService
  ) { }

  navigateToPost() {
    this.routerService.navigateToPage(`stories/post/${this.post.id}/${this.post.title.split(' ').join('-')}`);
  }

}

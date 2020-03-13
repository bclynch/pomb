import { Component, Input } from '@angular/core';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

import { Post } from '../../models/Post.model';

@Component({
  selector: 'app-compact-hero',
  templateUrl: './compactHero.component.html',
  styleUrls: ['./compactHero.component.scss']
})
export class CompactHeroComponent {
  @Input() post: Post;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService
  ) { }

  navigateToPost() {
    this.routerService.navigateToPage(`stories/post/${this.post.id}/${this.post.title.split(' ').join('-')}`);
  }

}

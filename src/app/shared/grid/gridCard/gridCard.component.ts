import { Component, Input, OnInit } from '@angular/core';

import { SettingsService } from '../../../services/settings.service';
import { RouterService } from '../../../services/router.service';

import { ImageType } from '../../../models/Image.model';

@Component({
  selector: 'app-grid-card',
  templateUrl: './gridCard.component.html',
  styleUrls: ['./gridCard.component.scss']
})
export class GridCardComponent implements OnInit {
  @Input() data;
  @Input() size: number;

  thumbnailImage: string;

  constructor(
    public settingsService: SettingsService,
    public routerService: RouterService
  ) { }

  ngOnInit() {
    this.data.imagesByPostId.nodes.forEach((img) => {
      if (img.type === ImageType.LEAD_LARGE) {
        this.thumbnailImage = img.url;
      }
    });
  }

  navigateToPost() {
    this.routerService.navigateToPage(`/stories/post/${this.data.id}/${this.data.title.split(' ').join('-')}`);
  }
}

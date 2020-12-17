import { Component, Input, OnChanges } from '@angular/core';

import { RouterService } from '../../../services/router.service';
import { SettingsService } from '../../../services/settings.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { UserService } from '../../../services/user.service';

import { ImageType } from '../../../models/Image.model';

@Component({
  selector: 'app-post-wrapper',
  templateUrl: 'postWrapper.component.html',
  styleUrls: ['./postWrapper.component.scss']
})
export class PostWrapperComponent implements OnChanges {
  @Input() post;
  @Input() isPreview = false;

  galleryImages = [];
  tags: string[] = [];
  views: number;
  disqusId: string;

  relatedPosts = [];

  constructor(
    public routerService: RouterService,
    public settingsService: SettingsService,
    private analyticsService: AnalyticsService,
    public userService: UserService
  ) { }

  ngOnChanges() {
    if (this.post) {
      this.disqusId = `post/${this.post.id}`;
      this.post.imagesByPostId.nodes.forEach((image) => {
        if (image.type === ImageType.GALLERY) {
          this.galleryImages.push(image);
        }
      });
      this.tags = this.post.postToTagsByPostId.nodes.map((tag) => tag.postTagByPostTagId.name);

      this.analyticsService.getPageViews().then(
        ({ data }) => {
          this.views = data.views;
        }
      );

      if (!this.isPreview) {
        this.populateRelatedPosts();
      }
    }
  }

  populateRelatedPosts(): void {
    this.relatedPosts = [];
    if (this.tags.length) {
      this.post.postToTagsByPostId.nodes[0].postTagByPostTagId.postToTagsByPostTagId.nodes.forEach(
        ({ postByPostId }) => {
          if (this.relatedPosts
            .map(({ id }) => id)
            .indexOf(postByPostId.id) === -1 && postByPostId.id !== this.post.id
          ) {
            this.relatedPosts.push(postByPostId);
          }
        }
      );
    }
  }
}

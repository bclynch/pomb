import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SettingsService } from '../../../services/settings.service';
import { RouterService } from '../../../services/router.service';
import { AppService } from '../../../services/app.service';

import { SubscriptionLike } from 'rxjs';
import { AllPublishedPostsGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnDestroy {

  archivePage: number;
  totalPages: number;
  posts = [];
  gridPosts = [];
  otherPosts = [];
  gridConfiguration: number[] = [ 5, 5 ];

  initSubscription: SubscriptionLike;

  constructor(
    private router: Router,
    public settingsService: SettingsService,
    public routerService: RouterService,
    private route: ActivatedRoute,
    private appService: AppService,
    private allPublishedPostsGQL: AllPublishedPostsGQL
  ) {
    this.route.params.subscribe((params) => {
      this.archivePage = params.page ? +params.page : 1;
      this.initSubscription = this.appService.appInited.subscribe(
        (inited) =>  {
          if (inited) {
            this.init();
          }
        }
      );
    });
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  init() {
    this.settingsService.modPageMeta(
      `Stories Archive - Page ${this.archivePage}`,
      'Listing of older stories and posts from around the Pack On My Back community.'
    );

    // fetch posts offset correctly based on page param
    this.allPublishedPostsGQL.fetch({
      quantity: 20,
      offset: 20 * this.archivePage
    }).subscribe(
      ({ data }) => {
        this.totalPages = Math.ceil((data.allPosts.totalCount - 20) / 20);
        this.posts = data.allPosts.nodes;
        this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
        this.otherPosts = this.posts.slice(this.gridConfiguration.length);
      }
    );
  }
}

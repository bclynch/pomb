import { Component, OnDestroy } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { RouterService } from '../../../services/router.service';
import { AllPublishedPostsGQL } from '../../../generated/graphql';
import { AppService } from 'src/app/services/app.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  posts = [];
  gridPosts = [];
  compactHeroPost = null;
  otherPosts = [];
  gridConfiguration: number[] = [ 6.5, 3.5, 3.5, 6.5, 3, 3, 3 ];

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    public utilService: UtilService,
    public routerService: RouterService,
    private allPublishedPostsGQL: AllPublishedPostsGQL,
    private appService: AppService
  ) {
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.init();
        }
      }
    );
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  init() {
    this.settingsService.modPageMeta(
      'Stories',
      'See what new posts are available from around Pack On My Back. Learn and be inspired by our users stories.'
    );
    this.allPublishedPostsGQL.fetch({
      quantity: 20,
      offset: 0
    }).subscribe(({ data }) => {
      this.posts = data.allPosts.nodes;
      // console.log(this.posts);
      this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
      this.compactHeroPost = this.posts.slice(this.gridConfiguration.length, this.gridConfiguration.length + 1)[0];
      this.otherPosts = this.posts.slice(this.gridConfiguration.length + 1);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  navigateToPost(post) {
    this.routerService.navigateToPage(`/stories/post/${post.id}/${post.title.split(' ').join('-')}`);
  }

  navigateToAuthor(e, username: string) {
    // stop bubbling to other click listener
    e.stopPropagation();

    this.routerService.navigateToPage(`/user/${username}`);
  }
}

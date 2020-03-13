import { Component } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { BroadcastService } from '../../../services/broadcast.service';
import { UtilService } from '../../../services/util.service';
import { RouterService } from '../../../services/router.service';
import { Post } from '../../../models/Post.model';
import { AllPublishedPostsGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  posts = [];
  gridPosts: Post[] = [];
  compactHeroPost: Post = null;
  otherPosts: Post[] = [];
  gridConfiguration: number[] = [ 6.5, 3.5, 3.5, 6.5, 3, 3, 3 ];

  constructor(
    public settingsService: SettingsService,
    private broadcastService: BroadcastService,
    public utilService: UtilService,
    public routerService: RouterService,
    private allPublishedPostsGQL: AllPublishedPostsGQL
  ) {
    this.settingsService.appInited
      ? this.init()
      : this.broadcastService.on(
        'appIsReady',
        () => this.init()
      );
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

  navigateToPost(post: Post) {
    this.routerService.navigateToPage(`/stories/post/${post.id}/${post.title.split(' ').join('-')}`);
  }

  navigateToAuthor(e, username: string) {
    // stop bubbling to other click listener
    e.stopPropagation();

    this.routerService.navigateToPage(`/user/${username}`);
  }
}

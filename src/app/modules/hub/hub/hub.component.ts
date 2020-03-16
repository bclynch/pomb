import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';

import { Post } from '../../../models/Post.model';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { PostsByTripGQL, AllPostToTagsGQL } from 'src/app/generated/graphql';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss'],
})
export class HubComponent implements OnDestroy {
  isTripPosts = false;
  currentHub: string;
  hubDescription = null;
  posts = [];
  gridPosts: Post[] = [];
  otherPosts: Post[] = [];
  gridConfiguration: number[] = [ 5, 5 ];

  initSubscription: SubscriptionLike;

  constructor(
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private appService: AppService,
    private postsByTripGQL: PostsByTripGQL,
    private allPostToTagsGQL: AllPostToTagsGQL
  ) {
    this.route.params.subscribe((params) => {
      if (params.tag) {
        this.currentHub = params.tag;
      } else if (params.tripId) {
        this.currentHub = params.tripId;
        this.isTripPosts = true;
      }

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
    // if it's a trip get posts by trip id otherwise by post tag
    if (this.isTripPosts) {
      this.postsByTripGQL.fetch({
        id: +this.currentHub
      }).subscribe(
        data => {
          const tripPosts = [];
          const tripData = data as any;
          this.currentHub = `${tripData.data.tripById.name} Posts`;
          this.settingsService.modPageMeta(
            `${tripData.data.tripById.name} Posts`,
            `See all posts from the trip, ${tripData.data.tripById.name}, as it chronicles a journey with Pack On My Back`
          );
          const junctures = tripData.data.tripById.juncturesByTripId.nodes;
          junctures.forEach((juncture) => {
            const juncturePosts = juncture.junctureToPostsByJunctureId.nodes;
            if (juncturePosts.length) {
              juncturePosts.forEach(({ postByPostId }) => {
                tripPosts.push(postByPostId);
              });
          }
          });
          this.posts = tripPosts;
          this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
          this.otherPosts = this.posts.slice(this.gridConfiguration.length);
        }
      );
    } else {
      this.allPostToTagsGQL.fetch({
        tagId: this.currentHub
      }).subscribe(({ data }) => {
        this.settingsService.modPageMeta(this.currentHub, `See all posts from the ${this.currentHub} tag`);
        this.posts = data.allPostToTags.nodes.map((node) => node.postByPostId);
        this.gridPosts = this.posts.slice(0, this.gridConfiguration.length);
        this.otherPosts = this.posts.slice(this.gridConfiguration.length);
      },
      (error) => console.log('there was an error sending the query', error));
    }
  }
}

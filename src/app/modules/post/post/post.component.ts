import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SettingsService } from '../../../services/settings.service';
import { UserService } from '../../../services/user.service';
import { UtilService } from '../../../services/util.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { PostByIdGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnDestroy {
  post;
  postId: number;

  initSubscription: SubscriptionLike;

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private userService: UserService,
    private utilService: UtilService,
    private appService: AppService,
    private postByIdGQL: PostByIdGQL
  ) {
    this.route.params.subscribe((params) => {
      this.postId = params.id;
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
    console.log(this.userService.user);
    this.postByIdGQL.fetch({
      id: +this.postId,
      userId: this.userService.user ? this.userService.user.id : null
    }).subscribe(
      ({ data }) => {
        this.post = data.postById;
        console.log(this.post);
        this.settingsService.modPageMeta(
          this.post.title,
          this.utilService.truncateString(this.utilService.stripHTMLTags(this.post.content), 145)
        );
      },
      err => console.log(err)
    );
  }
}

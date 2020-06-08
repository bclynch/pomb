import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { UserService } from '../../../services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { AccountByUsernameGQL, AllImagesByTripGQL, AllImagesByUserGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnDestroy {

  tripId: number;
  isTrip = false;

  userId: number;

  callQuant = 12;
  index = 0;

  gallery = [];

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    private route: ActivatedRoute,
    public utilService: UtilService,
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private appService: AppService,
    private accountByUsernameGQL: AccountByUsernameGQL,
    private allImagesByTripGQL: AllImagesByTripGQL,
    private allImagesByUserGQL: AllImagesByUserGQL
  ) {
    this.route.params.subscribe((params) => {
      // photos page will either be all photos from a trip or all from a user
      // maybe eventually it would be cool to grab photos from locales or tags, but for now this works
      if (params.username) {
        this.settingsService.modPageMeta(`Photos By ${params.username}`, `All photos taken by ${params.username}`);
        this.accountByUsernameGQL.fetch({
          username: params.username,
          userId: this.userService.user ? this.userService.user.id : null
        }).subscribe(({ data }) => {
          const user = data.accountByUsername;
          this.userId = user.id;
        }, (error) => {
          console.log('there was an error sending the query', error);
        });
      } else if (params.tripId) {
        this.settingsService.modPageMeta(`Trip Photos`, `All trip photos`);
        this.tripId = params.tripId;
        this.isTrip = true;
      }

      this.initSubscription = this.appService.appInited.subscribe(
        (inited) =>  {
          if (inited) {
            this.init();
          }
        }
      );
    });

    // subscribing to infiniteActive
    this.utilService.infiniteActive$.subscribe(() => {
      console.log('INFINITE ACTIVE', this.utilService.infiniteActive);
      if (this.utilService.infiniteActive) {
        setTimeout(() => this.loadMoreImages(), 500);
      }
    });
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  init() {
    // this gets turned off on router changes so we turn on here to hook knto our scroll directive
    this.utilService.checkScrollInfinite = true;
    this.utilService.allFetched = false;

    this.loadMoreImages();
  }

  loadMoreImages() {
    console.log('load more');
    if (this.isTrip) {
      this.allImagesByTripGQL.fetch({
        tripId: this.tripId,
        first: this.callQuant,
        offset: this.index,
        userId: this.userService.user ? this.userService.user.id : null
      }).subscribe(
        ({ data }) => {
          console.log(data);
          this.gallery = this.gallery.concat(data.allImages.nodes);
          if (data.allImages.nodes.length < this.callQuant) {
            this.utilService.allFetched = true;
          }
        }
      );
    } else {
      this.allImagesByUserGQL.fetch({
        userId: this.userId,
        first: this.callQuant,
        offset: this.index
      }).subscribe(
        ({ data }) => {
          console.log(data);
          this.gallery = this.gallery.concat(data.allImages.nodes);
          if (data.allImages.nodes.length < this.callQuant) {
            this.utilService.allFetched = true;
          }
        },
        err => console.log(err)
      );
    }

    this.index += 12;
    // setting a timeout so it doesn't fire another call right away
    setTimeout(() => this.utilService.toggleInfiniteActive(false), 3000);
  }
}

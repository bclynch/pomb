import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { RouterService } from '../../../services/router.service';
import { TripService } from '../../../services/trip.service';
import { ExploreService } from '../../../services/explore.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { UserService } from '../../../services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { PostsByTripGQL, TripByIdGQL } from 'src/app/generated/graphql';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnDestroy, AfterViewInit {
  disqusId: string;

  carouselImages: { imgURL: string; tagline: string; }[] = [];
  carouselTripData: { totalLikes: number; likesArr: { id: number }[]; tripId: number; } = {
    totalLikes: null,
    likesArr: [],
    tripId: null
  };
  gallery = [];

  subnavOptions = ['Highlights', 'Map', 'Junctures', 'Posts', 'Photos'];

  tripId: number;
  tripData;

  glanceExpanded = false;

  stats: { icon: string; label: string; value: number }[] = [];

  junctureMarkers = [];

  countryFlags: { code: string; name: string; }[] = [];

  tripPosts = [];
  postCount: number;

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    private utilService: UtilService,
    public routerService: RouterService,
    private route: ActivatedRoute,
    public tripService: TripService,
    public sanitizer: DomSanitizer,
    private exploreService: ExploreService,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    private appService: AppService,
    private tripByIdGQL: TripByIdGQL,
    private postsByTripGQL: PostsByTripGQL
  ) {
    this.route.params.subscribe((params) => {
      this.tripId = +params.tripId;
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
    this.countryFlags = [];

    this.tripByIdGQL.fetch({
      id: this.tripId,
      userId: this.userService.user ? this.userService.user.id : null
    }).subscribe(({ data }) => {
      this.tripData = data.tripById || {};
      const {
        id: tripId,
        name,
        banners = {},
        gallery = {},
        totalLikes: tripTotalLikes = {},
        likesByUser: tripLikesByUser = {},
        juncturesByTripId = {}
      } = this.tripData;
      this.disqusId = `trip/${tripId}`;
      this.settingsService.modPageMeta(
        name,
        `The main page for ${name}. Follow in their footsteps and see the junctures,
          photos, and posts that made up this journey.`
      );

      this.carouselImages = [];
      this.gallery = [];
      // populate img arrays
      banners.nodes.forEach(({ url, title }) => {
        this.carouselImages.push({ imgURL: url, tagline: title });
      });
      gallery.nodes.forEach(({ url, description, accountByUserId, totalLikes, likesByUser, id }) => {
        this.gallery.push({
          url,
          description,
          accountByUserId: { username: accountByUserId.username },
          totalLikes,
          likesByUser,
          id
        });
      });
      this.carouselTripData = {
        totalLikes: tripTotalLikes.totalCount,
        likesArr: tripLikesByUser.nodes,
        tripId
      };

      this.junctureMarkers = juncturesByTripId.nodes;

      // // populate flags array
      this.junctureMarkers.forEach((juncture) => {
        if (this.countryFlags.map(obj => obj.code).indexOf(juncture.country.toLowerCase()) === -1) {
          this.countryFlags.push({
            code: juncture.country.toLowerCase(),
            name: this.exploreService.countryCodeObj[juncture.country].name
          });
        }
      });

      // populate posts arr
      // Separated it out so we don't make the posts call for other pages that use this endpoint
      this.postsByTripGQL.fetch({
        id: tripId
      }).subscribe(
        ({ data: { tripById: { postsByTripId } = {} } = {} }) => {
          this.postCount = postsByTripId.totalCount;
          this.tripPosts = postsByTripId.nodes.slice(0, 5);

          this.populateStats();
        }
      );
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  ngAfterViewInit(): void {
    try {
      document.getElementById(this.routerService.fragment).scrollIntoView();
    } catch (e) { }
  }

  scrollTo(option: string): void {
    document.getElementById(option).scrollIntoView({behavior: 'smooth'});
  }

  populateStats(): void {
    this.stats = [
      {
        icon: 'git-merge',
        label: 'Junctures',
        value: this.tripData.juncturesByTripId.totalCount
      },
      {
        icon: 'globe-outline',
        label: 'Countries',
        value: this.countryFlags.length || 1
      },
      {
        icon: 'images',
        label: 'Photos',
        value: this.tripData.imagesByTripId.totalCount
      },
      {
        icon: 'albums',
        label: 'Posts',
        value: this.postCount
      },
      {
        icon: 'calendar-outline',
        label: 'Days',
        value: this.utilService.differenceDays(+this.tripData.startDate, +this.tripData.endDate)
      }
    ];
    this.analyticsService.getPageViews().then(
      ({ views }) => {
        this.stats.push({ icon: 'eye', label: 'Views', value: views });
      }
    );
  }
}

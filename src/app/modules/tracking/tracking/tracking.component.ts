import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { UserService } from '../../../services/user.service';
import { TripService } from '../../../services/trip.service';
import { UtilService } from '../../../services/util.service';

import { User } from '../../../models/User.model';
import { Trip } from '../../../models/Trip.model';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { UserTrackedTripsGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
})
export class TrackingComponent implements OnDestroy {
  inited = false;

  upcomingTrips = [];
  activeTrips = [];
  completeTrips = [];

  containers: { label: string; arr; }[] = [
    { label: 'Upcoming Trips', arr: this.upcomingTrips },
    { label: 'Active Trips', arr: this.activeTrips },
    { label: 'Completed Trips', arr: this.completeTrips }
  ];

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    public router: Router,
    private userService: UserService,
    private tripService: TripService,
    private utilService: UtilService,
    public sanitizer: DomSanitizer,
    private appService: AppService,
    private userTrackedTripsGQL: UserTrackedTripsGQL
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
    this.settingsService.modPageMeta('Tracking', 'Keep up to date with all the people you follow.');
    this.userTrackedTripsGQL.fetch({
      username: this.userService.user.username
    }).subscribe(
      ({ data }) => {
        const trackingData = data.accountByUsername.tracksByUserId.nodes;
        console.log(trackingData);
        trackingData.forEach((user) => {
          user.accountByTrackUserId.tripsByUserId.nodes.forEach((trip) => {
            switch (this.tripService.tripStatus(+trip.startDate, trip.endDate ? +trip.endDate : null)) {
              case 'active':
                this.activeTrips.push({ user, trip });
                break;
              case 'complete':
                this.completeTrips.push({ user, trip });
                break;
              case 'upcoming':
                this.upcomingTrips.push({ user, trip });
                break;
            }
          });
        });
        this.inited = true;
      }
    );
  }

  calcStart(start: number): number {
    return this.utilService.differenceDays(Date.now(), start);
  }
}

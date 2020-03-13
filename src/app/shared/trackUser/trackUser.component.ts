import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { CreateTrackGQL, DeleteTrackByIdGQL, CheckTrackingByUserGQL } from '../../generated/graphql';

@Component({
  selector: 'app-track-user',
  templateUrl: './trackUser.component.html',
  styleUrls: ['./trackUser.component.scss']
})
export class TrackUserComponent implements OnChanges {
  @Input() trackUserId: number;

  displayComponent = true;
  isTracking = false;
  trackingId: number;

  constructor(
    public settingsService: SettingsService,
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private alertService: AlertService,
    private createTrackGQL: CreateTrackGQL,
    private deleteTrackByIdGQL: DeleteTrackByIdGQL,
    private checkTrackingByUserGQL: CheckTrackingByUserGQL
  ) {

  }

  ngOnChanges() {
    if (this.userService.user) {
      if (this.trackUserId === this.userService.user.id) {
        this.displayComponent = false;
      }
      this.checkTrackingByUserGQL.fetch({
        trackedUser: this.trackUserId,
        trackingUser: this.userService.user.id
      }).subscribe(
        ({ data }) => {
          if (data.accountById.tracksByTrackUserId.nodes.length) {
            this.isTracking = true;
            this.trackingId = data.accountById.tracksByTrackUserId.nodes[0].id;
          }
        },
        err => console.log(err)
      );
    } else {
      this.displayComponent = false;
    }
  }

  trackUser() {
    if (!this.userService.user.id) {
      this.alertService.alert('Tracking Error', 'Please login in order to track users');
      return;
    } else {
      this.createTrackGQL.mutate({
        userId: this.userService.user.id,
        trackUserId: this.trackUserId
      }).subscribe(
        () => {
          this.isTracking = true;
        }
      );
    }
  }

  unTrackUser() {
    this.deleteTrackByIdGQL.mutate({
      trackId: this.trackingId
    }).subscribe(
      () => {
        this.isTracking = false;
      }
    );
  }
}

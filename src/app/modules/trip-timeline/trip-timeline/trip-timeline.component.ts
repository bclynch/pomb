import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../../services/settings.service';
import { JunctureService } from '../../../services/juncture.service';
import { RouterService } from '../../../services/router.service';
import { UserService } from '../../../services/user.service';
import { UtilService } from '../../../services/util.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { TripByIdGQL } from 'src/app/generated/graphql';

@Component({
  selector: 'app-trip-timeline',
  templateUrl: './trip-timeline.component.html',
  styleUrls: ['./trip-timeline.component.scss'],
})
export class TripTimelineComponent implements OnDestroy {
  tripId: number;
  tripData;

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    public sanitizer: DomSanitizer,
    public junctureService: JunctureService,
    private route: ActivatedRoute,
    public routerService: RouterService,
    private userService: UserService,
    public utilService: UtilService,
    private appService: AppService,
    private tripByIdGQL: TripByIdGQL
  ) {
    this.route.params.subscribe((params) => {
      this.tripId = params.tripId;
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
    this.tripByIdGQL.fetch({
      id: +this.tripId,
      userId: this.userService.user ? this.userService.user.id : null
    }).subscribe(({ data }) => {
      this.tripData = data.tripById;
      this.settingsService.modPageMeta(
        `${this.tripData.name} Timeline`,
        `Follow along and see the junctures that made ${this.tripData.name} an experience of a lifetime.`
      );
    });
  }

  scrollTo(option: string) {
    document.getElementById(option).scrollIntoView({behavior: 'smooth'});
  }

  rangeChange(e) {
    const junctureNumber = e.detail.value;
    if (junctureNumber !== 0) {
      this.scrollTo(`juncture${junctureNumber - 1}`);
    }
  }

  junctureImage(juncture) {
    return juncture.markerImg || this.junctureService.defaultMarkerImg;
  }
}

import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

import { UserService } from '../../../../services/user.service';
import { SettingsService } from '../../../../services/settings.service';
import { AppService } from '../../../../services/app.service';
import { UtilService } from '../../../../services/util.service';
import { RouterService } from '../../../../services/router.service';
import { TripService } from '../../../../services/trip.service';
import { JunctureService } from '../../../../services/juncture.service';
import { TripModalComponent } from '../../../tripModal/tripModal/tripModal';
import { JunctureModalComponent } from '../../../junctureModal/junctureModal/junctureModal';

// import { Trip } from '../../../../models/Trip.model';
import { SubscriptionLike } from 'rxjs';
import { TripsByUserDashboardGQL } from '../../../../generated/graphql';

@Component({
  selector: 'page-useradmin-trips',
  templateUrl: 'trips.html',
  styleUrls: ['./trips.scss']
})
export class UserAdminTripsPage implements OnDestroy {

  tripsQuery;
  tripsData;
  activeTrip: number = null;

  initSubscription: SubscriptionLike;

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    public settingsService: SettingsService,
    private appService: AppService,
    private utilService: UtilService,
    public routerService: RouterService,
    public sanitizer: DomSanitizer,
    public tripService: TripService,
    private junctureService: JunctureService,
    private tripsByUserDashboardGQL: TripsByUserDashboardGQL
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
    // splitting up to refetch below on edits
    this.tripsQuery = this.tripsByUserDashboardGQL.fetch({
      id: this.userService.user.id
    }).subscribe(
      ({ data }) => {
        this.tripsData = data.allTrips.nodes;
      }
    );
  }

  daysTraveling(index: number) {
    const days = this.utilService.differenceDays(+this.tripsData[index].startDate, +this.tripsData[index].endDate);
    return days === 1 ? `${days} day` : `${days} days`;
  }

  async editTrip(index: number) {
    const tripId = this.tripsData[index].id;
    const modal = await this.modalCtrl.create({
      component: TripModalComponent,
      componentProps: { tripId },
      cssClass: 'tripModal',
      backdropDismiss: false
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.tripService.handleOpenTripModal(data, tripId);
  }

  async editJuncture(index: number) {
    const junctureId = this.tripsData[this.activeTrip].juncturesByTripId.nodes[index].id;
    const modal = await this.modalCtrl.create({
      component: JunctureModalComponent,
      componentProps: { markerImg: this.junctureService.defaultMarkerImg, junctureId },
      cssClass: 'junctureModal',
      backdropDismiss: false
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.junctureService.handleOpenJunctureModal(data, junctureId);
  }
}

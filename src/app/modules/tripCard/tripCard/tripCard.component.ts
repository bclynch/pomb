import { Component, Input, OnChanges } from '@angular/core';
import { RouterService } from '../../../services/router.service';
import { UtilService } from '../../../services/util.service';
import { TripService } from '../../../services/trip.service';
import { Trip } from '../../../models/Trip.model';

@Component({
  selector: 'app-trip-card',
  templateUrl: './tripCard.component.html',
  styleUrls: ['./tripCard.component.scss']
})
export class TripCardComponent implements OnChanges {
  @Input() trip: Trip;

  defaultPhoto = '../../assets/images/trip-default.jpg';
  tripStatus: string;

  constructor(
    private routerService: RouterService,
    private utilService: UtilService,
    private tripService: TripService
  ) { }

  ngOnChanges() {
    if (this.trip) {
      this.tripStatus = this.tripService.tripStatus(+this.trip.startDate, +this.trip.endDate
        ? +this.trip.endDate
        : null
      );
    }
  }

  navigateToTrip() {
    this.routerService.navigateToPage(`/trip/${this.trip.id}`);
  }

  daysTraveling() {
    if (!this.trip) {
      return;
    }
    const days = this.utilService.differenceDays(+this.trip.startDate, +this.trip.endDate);
    return days === 1 ? `${days} day` : `${days} days`;
  }
}

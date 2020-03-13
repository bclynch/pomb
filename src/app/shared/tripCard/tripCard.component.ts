import { Component, Input } from '@angular/core';
import { RouterService } from '../../services/router.service';
import { UtilService } from '../../services/util.service';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/Trip.model';

@Component({
  selector: 'app-trip-card',
  templateUrl: './tripCard.component.html',
  styleUrls: ['./tripCard.component.scss']
})
export class TripCardComponent {
  @Input() trip: Trip;

  defaultPhoto = '../../assets/images/trip-default.jpg';

  constructor(
    private routerService: RouterService,
    private utilService: UtilService,
    public tripService: TripService
  ) { }

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

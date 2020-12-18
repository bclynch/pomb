import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

import { SettingsService } from '../../../services/settings.service';
import { UserService } from '../../../services/user.service';
import { TripService } from '../../../services/trip.service';
import { TripModalComponent } from '../../tripModal/tripModal/tripModal';

@Component({
  selector: 'app-fade-carousel',
  templateUrl: 'fadeCarousel.component.html',
  styleUrls: ['./fadeCarousel.component.scss']
})
export class FadeCarouselComponent implements OnChanges {
  @Input() data = [];
  @Input() tripData: { totalLikes: number; likesArr: { id: number }[]; tripId: number; };
  @Input() title: string;
  @Input() btnLabel: string;
  @Input() flags: { url: string; name: string; }[] = [];
  @Input() stats: { icon: string; label: string; value: number }[] = [];
  @Input() userId: number;
  @Output() btnClick = new EventEmitter<any>();

  displayedIndex = 0;

  constructor(
    private modalCtrl: ModalController,
    public settingsService: SettingsService,
    public sanitizer: DomSanitizer,
    public userService: UserService,
    private tripService: TripService
  ) {
    setInterval(() => {
      this.displayedIndex = this.displayedIndex === this.data.length - 1 ? 0 : this.displayedIndex + 1;
    }, 10000);
  }

  ngOnChanges() {
    if (this.data && !this.data.length) {
      this.data = [{ imgURL: '', tagline: '' }];
    }
    // console.log(this.data);
  }

  onBtnClick(): void {
    this.btnClick.emit();
  }

  async editTrip() {
    const tripId = this.tripData.tripId;
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
}

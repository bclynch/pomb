import { Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsService } from '../../../services/settings.service';

import { ExploreModalComponent } from '../../../shared/exploreModal/exploreModal';
import { AppService } from 'src/app/services/app.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnDestroy {
  countryCodes: string[][];

  carouselImages;
  inited = false;

  modalData = [
    {
      label: 'Popular Regions',
      items: ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']
    },
    {
      label: 'Popular Countries',
      items: ['China', 'France', 'Spain', 'Brazil', 'Iceland', 'South Africa', 'Japan', 'Russia', 'Mexico', 'India']
    }
  ];

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    private modalController: ModalController,
    private appService: AppService
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
    // this.countryCodes = this.exploreService.requestCountryCodes('all');
    this.countryCodes = [
      ['Country', 'Name'],
      ['CN', 'China'],
      ['JP', 'Japan'],
      ['US', 'United States'],
      ['CA', 'Canada'],
      ['MX', 'Mexico']
    ];

    // grab flickr images for the carousel
    // this.apiService.getFlickrPhotos('travel', 'landscape', 5).subscribe(
    //   result => {
    //     console.log(result.photos.photo);
    //     const photos = result.photos.photo.slice(0, 5);
    //     this.carouselImages = photos.map((photo) => {
    //       // _b is 'large' img request so 1024 x 768. We'll go with this for now
    //       // _o is 'original' which is 2400 x 1800
    //       return {
    //   imgURL: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
    //   tagline: photo.title
    // };
    //     });
    this.inited = true;
    //   }
    // );
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ExploreModalComponent,
      componentProps: { data: this.modalData },
      cssClass: 'exploreModal'
    });

    await modal.present();
  }
}

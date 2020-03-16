import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../../services/api.service';
import { UtilService } from '../../../services/util.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'page-explore-city',
  templateUrl: './explore.city.html',
  styleUrls: ['./explore.city.scss'],
})
export class ExploreCityPage implements OnDestroy {

  carouselImages;
  city;

  initSubscription: SubscriptionLike;

  constructor(
    private apiService: APIService,
    private utilService: UtilService,
    private route: ActivatedRoute,
    private appService: AppService
  ) {
    this.route.params.subscribe(params => {
      // grab city name
      this.city = this.utilService.formatURLString(params.city);

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
    // grab flickr images for the carousel
    this.apiService.getFlickrPhotos(this.city, 'architecture', 5).subscribe(
      result => {
        console.log(result.photos.photo);
        const photos = result.photos.photo.slice(0, 5);
        this.carouselImages = photos.map((photo) => {
          // _b is 'large' img request so 1024 x 768. We'll go with this for now
          // _o is 'original' which is 2400 x 1800
          return {
            imgURL: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
            tagline: photo.title
          };
        });
      }
    );
  }
}

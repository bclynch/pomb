import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { ExploreService } from '../../../services/explore.service';
import { UtilService } from '../../../services/util.service';
import { RouterService } from '../../../services/router.service';
import { AlertService } from '../../../services/alert.service';
import { ExploreModalComponent } from '../exploreModal/exploreModal';
import { AppService } from '../../../services/app.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'page-explore-region',
  templateUrl: 'explore.region.html'
})
export class ExploreRegionPage implements OnDestroy {

  countryCodes: string[][];
  inited = false;
  currentRegion = {code: '', name: ''};
  isSubregion: boolean;
  urlParams;

  carouselImages;

  modalData = [
    {
      label: 'Popular Countries',
      items: []
    }
  ];

  initSubscription: SubscriptionLike;

  constructor(
    private apiService: APIService,
    public settingsService: SettingsService,
    private exploreService: ExploreService,
    private modalController: ModalController,
    private utilService: UtilService,
    private route: ActivatedRoute,
    private routerService: RouterService,
    private alertService: AlertService,
    private appService: AppService
  ) {
    this.route.params.subscribe(params => {
      this.urlParams = params;
      // check if subregion
      this.isSubregion = params.subregion ? true : false;
      // grab region name
      this.currentRegion.name = this.isSubregion
        ? this.utilService.formatURLString(params.subregion)
        : this.utilService.formatURLString(params.region);

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
    if (this.exploreService.getGoogleCodeByName(this.currentRegion.name)) {
      this.currentRegion.code = this.exploreService.getGoogleCodeByName(this.currentRegion.name);

      this.countryCodes = this.isSubregion
        ? this.exploreService.requestCountryCodes(this.urlParams.region, this.currentRegion.name)
        : this.exploreService.requestCountryCodes(this.currentRegion.name);

      // grab flickr images for the carousel
      this.apiService.getFlickrPhotos(this.currentRegion.name, 'landscape', 5).subscribe(
        ({ photos: flickrPhotos }: any) => {
          const photos = flickrPhotos.photo.slice(0, 5);
          this.carouselImages = photos.map(({ farm, server, id, secret, title }) => {
            // _b is 'large' img request so 1024 x 768. We'll go with this for now
            // _o is 'original' which is 2400 x 1800
            return {
              imgURL: `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_b.jpg`,
              tagline: title
            };
          });
          this.inited = true;
        }
      );

      // populate modal data
      this.modalData[0].items = this.countryCodes.slice(1, 11).reduce((a, b) => {
        return a.concat(b);
      }, []);
    } else {
      this.routerService.navigateToPage('/');
      this.alertService.alert('Error', 'The requested region does not exist');
    }
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

import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsAPILoader, AgmMap } from '@agm/core';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { RouterService } from '../../../services/router.service';
import { ExploreService } from '../../../services/explore.service';
import { AlertService } from '../../../services/alert.service';

import { ExploreModalComponent } from '../../../shared/exploreModal/exploreModal';
import { SubscriptionLike } from 'rxjs';
import { AppService } from 'src/app/services/app.service';

interface CityMarker {
  lat: number;
  lon: number;
  name: string;
  population: number;
}

@Component({
  selector: 'page-explore-country',
  templateUrl: 'explore.country.html'
})
export class ExploreCountryPage implements AfterViewInit {

  carouselImages;

  modalData = [
    {
      label: 'Popular Cities',
      items: []
    },
  ];

  subnavOptions = ['At a Glance', 'Country Guide', 'Map', 'Posts', 'Activities'];

  country: string;

  glanceSubsection = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet pharetra magna.
    Nulla pretium, ligula eu ullamcorper volutpat, libero diam malesuada est, vel euismod sapien turpis bibendum nulla.
    Donec tincidunt sed mauris et auctor. Curabitur malesuada lectus id elit vehicula efficitur.`;
  glanceContent = [
    {
      title: 'Section 1',
      content: this.glanceSubsection
    },
    {
      title: 'Section 2',
      content: this.glanceSubsection
    },
    {
      title: 'Section 3',
      content: this.glanceSubsection
    }
  ];
  glanceExpanded = false;

  latlngBounds;
  mapStyle;
  mapInited = false;
  cityMarkers: CityMarker[] = [];

  initSubscription: SubscriptionLike;

  constructor(
    private apiService: APIService,
    private router: Router,
    public settingsService: SettingsService,
    private modalController: ModalController,
    private utilService: UtilService,
    private routerService: RouterService,
    private exploreService: ExploreService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    public sanitizer: DomSanitizer,
    private mapsAPILoader: MapsAPILoader,
    private appService: AppService
  ) {
    this.route.params.subscribe(params => {
      // grab country name
      this.country = this.utilService.formatURLString(params.country);

      this.initSubscription = this.appService.appInited.subscribe(
        (inited) =>  {
          if (inited) {
            this.init();
          }
        }
      );
    });
  }

  init() {
    // check if country exists
    if (this.exploreService.countryNameObj[this.country]) {
      // grab flickr images for the carousel
      this.apiService.getFlickrPhotos(this.country, 'landscape', 5).subscribe(
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

      // bounds data for map
      this.mapsAPILoader.load().then(() => {
        this.apiService.geocodeCoords(this.country).subscribe(
          result => {
            const viewport = result.geometry.viewport;
            const viewportBounds = [{lat: viewport.f.b, lon: viewport.b.b}, {lat: viewport.f.f, lon: viewport.b.f}];
            console.log(viewportBounds);

            this.latlngBounds = result.geometry.viewport;

            // grab map style
            this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe((data) => {
              this.mapStyle = data;
              this.mapInited = true;
            });

            // grab cities for modal
            this.modalData[0].items = [];
            this.apiService.getCities(this.exploreService.countryNameObj[this.country].alpha2Code).subscribe(
              ({ geonames }) => {
                console.log(geonames);
                geonames.forEach((city) => {
                  this.modalData[0].items.push(city.name);
                  this.cityMarkers.push({
                    lat: +city.lat,
                    lon: +city.lng,
                    name: city.name,
                    population: city.population
                  });
                });
                console.log(this.cityMarkers);
              }, err => console.log(err)
            );
          }
        );
      });
    } else {
      this.routerService.navigateToPage('/');
      this.alertService.alert('Error', 'The requested country does not exist');
    }
  }

  ngAfterViewInit(): void {
    try {
      document.getElementById(this.routerService.fragment).scrollIntoView();
    } catch (e) { }
  }

  scrollTo(option: string) {
    document.getElementById(option).scrollIntoView({behavior: 'smooth'});
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ExploreModalComponent,
      componentProps: { data: this.modalData },
      cssClass: 'exploreModal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.goToCity(data);
    }
  }

  goToCity(city: string) {
    const country = this.utilService.formatForURLString(this.country);
    const formattedCity = this.utilService.formatForURLString(city);
    this.routerService.navigateToPage(`/explore/country/${country}/${formattedCity}`);
  }
}

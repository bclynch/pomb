import { Component, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

import { AppService } from '../../../../services/app.service';
import { RouterService } from '../../../../services/router.service';
import { UtilService } from '../../../../services/util.service';
import { SettingsService } from '../../../../services/settings.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-map-section',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapSectionComponent implements OnDestroy {
  @Input() junctureMarkers = [];
  @Input() tripData = { startLat: null, startLon: null };
  tripId: number;

  dataLayerStyle;

  // map props
  coords: { lat: number; lon: number; } = { lat: null, lon: null };
  zoomLevel = 6;
  latlngBounds;
  geoJsonObject: any = null;
  mapStyle;
  boundedZoom: number;

  initSubscription: SubscriptionLike;

  constructor(
    public routerService: RouterService,
    private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private appService: AppService,
    private utilService: UtilService,
    private settingsService: SettingsService
  ) {
    this.route.params.subscribe((params) => {
      this.tripId = +params.tripId;
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
    this.dataLayerStyle = {
      clickable: false,
      strokeColor: this.settingsService.secondaryColor,
      strokeWeight: 3
    };
    // fitting the map to the markers
    this.mapsAPILoader.load().then(() => {
      this.latlngBounds = new window.google.maps.LatLngBounds();
      this.junctureMarkers.forEach(({ lat, lon }) => {
        this.latlngBounds.extend(new window.google.maps.LatLng(lat, lon));
      });
      // making sure to check trip start point to compensate for it
      this.latlngBounds.extend(new window.google.maps.LatLng(this.tripData.startLat, this.tripData.startLon));

      // grab map style
      this.utilService.getJSON('../../assets/mapStyles/darkTheme.json').subscribe((data) => {
        this.mapStyle = data;
      });
    });
  }
}

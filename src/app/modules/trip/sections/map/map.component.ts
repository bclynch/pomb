import { Component, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

import { AppService } from '../../../../services/app.service';
import { RouterService } from '../../../../services/router.service';
import { UtilService } from '../../../../services/util.service';
import { SettingsService } from '../../../../services/settings.service';
import { GeoService } from '../../../../services/geo.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-map-section',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapSectionComponent implements OnDestroy {
  @Input() junctureMarkers = [];
  @Input() tripData = { startLat: null, startLon: null, startDate: null };
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
    private settingsService: SettingsService,
    private geoService: GeoService
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

      // trip coords
      const junctureArr = this.junctureMarkers.map((juncture) => {
        // if its got gpx coords add them
        if (juncture.coordsByJunctureId.nodes.length) {
          return juncture.coordsByJunctureId.nodes;
        }

        // else add its manual marker coords
        return [{
          lat: juncture.lat,
          lon: juncture.lon,
          elevation: 0,
          coordTime: new Date(+juncture.arrivalDate).toString()
        }];
      });
      // push starting trip marker to front of arr
      junctureArr.unshift([{
        lat: this.tripData.startLat,
        lon: this.tripData.startLon,
        elevation: 0,
        coordTime: new Date(+this.tripData.startDate).toString()
      }]);
      this.geoJsonObject = this.geoService.generateGeoJSON(junctureArr);
    });
  }
}

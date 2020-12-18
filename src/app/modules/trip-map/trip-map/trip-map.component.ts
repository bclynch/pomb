import { Component, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { AgmSnazzyInfoWindow } from '@agm/snazzy-info-window';

import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { GeoService } from '../../../services/geo.service';
import { RouterService } from '../../../services/router.service';
import { JunctureService } from '../../../services/juncture.service';
import { UserService } from '../../../services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { TripByIdGQL, PartialJunctureByIdGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-trip-map',
  templateUrl: './trip-map.component.html',
  styleUrls: ['./trip-map.component.scss'],
})
export class TripMapComponent implements OnDestroy {
  @ViewChild(AgmMap) private map: any;
  @ViewChildren(AgmSnazzyInfoWindow) snazzyWindowChildren: QueryList<any>;

  tripId: number;
  tripData;
  junctureMarkers = [];
  inited = false;
  defaultPhoto = '../../assets/images/trip-default.jpg';
  tripBanner: string;
  junctureIndex = 0;
  junctureContentArr: any = [];
  tempPanStart: number;
  markerLoading = false;

  // map props
  coords: { lat: number; lon: number; } = { lat: null, lon: null };
  zoomLevel: number;
  latlngBounds;
  geoJsonObject: any = null;
  mapStyle;
  boundedZoom: number;
  dataLayerStyle;
  fullscreen = false;
  clusterOptions = {
    gridSize: 60,
    minimumClusterSize: 2,
    averageCenter: true
  };

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    private mapsAPILoader: MapsAPILoader,
    public utilService: UtilService,
    public routerService: RouterService,
    private geoService: GeoService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public junctureService: JunctureService,
    public userService: UserService,
    private appService: AppService,
    private tripByIdGQL: TripByIdGQL,
    private partialJunctureByIdGQL: PartialJunctureByIdGQL
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
    // reset arrays
    this.junctureMarkers = [];
    this.junctureContentArr = [];

    this.tripByIdGQL.fetch({
      id: this.tripId,
      userId: this.userService.user ? this.userService.user.id : null
    }).subscribe(({ data }) => {
      this.tripData = data.tripById;
      this.settingsService.modPageMeta(
        `${this.tripData.name} Map`,
        `An interactive map plotting the route for ${this.tripData.name}. Follow in their footsteps and
          see the junctures, photos, and posts that made up this journey.`
      );

      // fill up arr with a bunch of empty values so our styling works properly
      // + create arr with copies so we can mod values
      for (let i = 0; i < this.tripData.juncturesByTripId.nodes.length; i++) {
        this.junctureMarkers.push({...this.tripData.juncturesByTripId.nodes[i]});
        this.junctureContentArr.push(null);
      }
      // populate first bit of our content for the pane
      if (this.tripData.juncturesByTripId.nodes[0]) {
        this.modJunctureContentArr(0, this.tripData.juncturesByTripId.nodes[0].id);
      }
      if (this.tripData.juncturesByTripId.nodes[1]) {
        this.modJunctureContentArr(1, this.tripData.juncturesByTripId.nodes[1].id);
      }
      // adding start trip marker
      this.junctureMarkers.unshift({
        lat: +this.tripData.startLat,
        lon: +this.tripData.startLon,
        name: 'Trip Start',
        markerImg: this.junctureService.defaultStartImg,
        arrivalDate: this.tripData.startDate,
        city: '',
        country: '',
        coordsByJunctureId: { nodes: [] },
        description: ''
      });
      // console.log('JUNCTURE MARKERS: ', this.junctureMarkers);

      // trip coords
      const junctureArr = this.tripData.juncturesByTripId.nodes.map(({ coordsByJunctureId, lat, lon, arrivalDate }) => {
        // if its got gpx coords add them
        if (coordsByJunctureId.nodes.length) {
          return coordsByJunctureId.nodes;
        }

        // else add its manual marker coords
        return [{
          lat,
          lon,
          elevation: 0,
          coordTime: new Date(+arrivalDate).toString()
        }];
      });
      // push starting trip marker to front of arr
      junctureArr.unshift([{
        lat: this.tripData.startLat,
        lon: this.tripData.startLon,
        elevation: 0,
        coordTime: new Date(+this.tripData.startDate).toString()
      }]);
      // console.log(junctureArr);
      this.geoJsonObject = this.geoService.generateGeoJSON(junctureArr);

      this.dataLayerStyle = {
        clickable: false,
        strokeColor: this.settingsService.secondaryColor,
        strokeWeight: 3
      };

      // populate tripBanner
      this.tripBanner = this.tripData.banners.nodes.length ? this.tripData.banners.nodes[0].url : null;

      // fitting the map to the markers
      this.mapsAPILoader.load().then(() => {
        this.latlngBounds = new window.google.maps.LatLngBounds();
        this.junctureMarkers.forEach((juncture) => {
          // coerce to number
          juncture.lat = +juncture.lat;
          juncture.lon = +juncture.lon;
          this.latlngBounds.extend(new window.google.maps.LatLng(juncture.lat, juncture.lon));
        });
        // making sure to check trip start point to compensate for it
        this.latlngBounds.extend(new window.google.maps.LatLng(+this.tripData.startLat, +this.tripData.startLon));

        // grab map style
        this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe((data) => {
          this.mapStyle = data;
          this.inited = true;
        });

        // console.log(this.junctureContentArr);
      });
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  changeIndex(i: number) {
    if (this.junctureIndex - i === 1) {
      // increment index of active juncture
      this.junctureIndex = this.junctureIndex - 1;

      // fetch new juncture data if required
      if (this.junctureIndex > 2) {
        this.modJunctureContentArr(
          this.junctureIndex - 1,
          this.tripData.juncturesByTripId.nodes[this.junctureIndex - 1].id
        );
      }

      // pan map to our new juncture location
      this.panToCoords(+this.tripData.juncturesByTripId.nodes[i].lat, +this.tripData.juncturesByTripId.nodes[i].lon);
    } else if (i - this.junctureIndex === 1) {
      // increment index of active juncture
      this.junctureIndex = this.junctureIndex + 1;

      // fetch new juncture data if required
      if (this.junctureIndex < this.tripData.juncturesByTripId.nodes.length - 1) {
        this.modJunctureContentArr(
          this.junctureIndex + 1,
          this.tripData.juncturesByTripId.nodes[this.junctureIndex + 1].id
        );
      }

      // pan map to our new juncture location
      this.panToCoords(+this.tripData.juncturesByTripId.nodes[i].lat, +this.tripData.juncturesByTripId.nodes[i].lon);
    }
  }

  // Adding content one at a time so as not to make a big ass call every time that would take forever.
  // One ahead so its always ready
  modJunctureContentArr(index: number, id: number) {
    return new Promise<void>((resolve) => {

      // make sure it doesn't already exist
      if (!this.junctureContentArr[index]) {
        this.partialJunctureByIdGQL.fetch({
          id,
          userId: this.userService.user ? this.userService.user.id : null
        }).subscribe(({ data }) => {
          // console.log(data);
          const junctureData = data.junctureById;
          if (!this.junctureContentArr[index]) {
            this.junctureContentArr.splice(index, 1, junctureData);
            // console.log(this.junctureContentArr);
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  markerClick(i: number) {
    // if its starting marker don't need to do anything
    if (i === 0) {
      return;
    }

    this.markerLoading = true;
    // check to see if we have data for this marker. If not fetch
    this.modJunctureContentArr(i - 1, this.junctureMarkers[i].id).then(() => this.markerLoading = false);
  }

  goToJuncture(i: number) {
    this.junctureIndex = i - 1;

    // need to snag the data for juncture on either side so they're loaded up
    if (i > 2) {
      this.modJunctureContentArr(i - 1, this.junctureMarkers[i - 1].id);
    }
    if (i < this.tripData.juncturesByTripId.nodes.length - 1) {
      this.modJunctureContentArr(i, this.junctureMarkers[i].id);
    }

    // programmatically close info window
    const livewindow = this.snazzyWindowChildren.find((window, index) => ( index === i - 1 ));
    livewindow._closeInfoWindow();
  }

  panToCoords(lat: number, lon: number) {
    this.coords.lat = lat;
    this.coords.lon = lon;
    // this.zoomLevel = this.boundedZoom < 8 ? this.boundedZoom + 2 : this.boundedZoom + 1;
    this.zoomLevel = 11;
    this.map._mapsWrapper.panTo({lat: this.coords.lat, lng: this.coords.lon});
  }

  onZoomChange(e) {
    // if original bound zoom value failed then apply this
    if (!this.boundedZoom) {
      this.boundedZoom = e;
    }
    this.zoomLevel = e;
  }

  panStart(e) {
    this.tempPanStart = e.center.x;
  }

  pan(e, type) {
    if (this.tempPanStart) {
      if (type === 'right') {
        if (e.distance > 400) {
          if (this.junctureIndex > 0) {
            this.changeIndex(this.junctureIndex - 1);
          }
          this.tempPanStart = null;
        }
      } else {
        if (e.distance > 400) {
          if (this.junctureIndex < this.tripData.juncturesByTripId.nodes.length - 1) {
            this.changeIndex(this.junctureIndex + 1);
          }
          this.tempPanStart = null;
        }
      }
    }
  }

  mapReady({ zoom }) {
    // bounded zoom is what the map originally used based on bounds formula and is useful for panning around later
    // is undefined on load, but this works otherwise
    if (zoom) {
      this.boundedZoom = zoom;
    }
  }

  toggleFullScreen() {
    this.fullscreen = !this.fullscreen;
    this.map.triggerResize();
  }
}

import { ViewChild, Component, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AgmMap, AgmDataLayer, MapsAPILoader } from '@agm/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

import { SettingsService } from '../../../services/settings.service';
import { GeoService } from '../../../services/geo.service';
import { UtilService } from '../../../services/util.service';
import { RouterService } from '../../../services/router.service';
import { ExploreService } from '../../../services/explore.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { UserService } from '../../../services/user.service';
import { JunctureService } from '../../../services/juncture.service';
import { AppService } from '../../../services/app.service';

import { Juncture } from '../../../models/Juncture.model';
import { SubscriptionLike } from 'rxjs';
import { FullJunctureByIdGQL } from 'src/app/generated/graphql';
import { JunctureModalComponent } from '../../junctureModal/junctureModal/junctureModal';

@Component({
  selector: 'app-juncture',
  templateUrl: './juncture.component.html',
  styleUrls: ['./juncture.component.scss'],
})
export class JunctureComponent implements OnDestroy {
  @ViewChild(AgmMap) private map: any;
  @ViewChild('distance') distance: any;
  @ViewChild('time') time: any;

  inited = false;
  disqusId: string;

  junctureId: number;
  junctureData;
  bannerImg: string;
  flag: { code: string; name: string };
  views: number;

  priorJuncture: Juncture;
  nextJuncture: Juncture;

  isProcessing = false;
  filesToUpload: Array<File> = [];

  isGPX = true;
  geoJsonObject = null;
  latlngBounds;
  mapStyle;
  dataLayerStyle;
  zoomLevel = 14;
  markerLat: number;
  markerLon: number;

  stats: { icon: string; iconColor: string; label: string; value: any; unitOfMeasure: string; }[];

  chartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
        backgroundColor: 'rgba(95,44,130,0.2)',
        borderColor: 'rgba(95,44,130,1)',
      },
      {
        label: '# of Points',
        data: [7, 11, 5, 8, 3, 7],
        borderWidth: 1,
        backgroundColor: 'rgba(73, 160, 157,0.2)',
        borderColor: 'rgba(73, 160, 157,1)'
      }
    ]
  };

  chartOptions = {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Neato Chart'
    },
    scales: {
      yAxes: [{
        ticks: {
          reverse: false
        }
      }]
    }
  };

  distanceChartData;
  distanceChartOptions;
  timeChartData;
  timeChartOptions;

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    private modalCtrl: ModalController,
    public router: Router,
    private geoService: GeoService,
    private mapsAPILoader: MapsAPILoader,
    private utilService: UtilService,
    private route: ActivatedRoute,
    public routerService: RouterService,
    public sanitizer: DomSanitizer,
    private exploreService: ExploreService,
    private analyticsService: AnalyticsService,
    public userService: UserService,
    private junctureService: JunctureService,
    private appService: AppService,
    private fullJunctureByIdGQL: FullJunctureByIdGQL
  ) {
    this.route.params.subscribe((params) => {
      this.junctureId = +params.junctureId;
      this.initSubscription = this.appService.appInited.subscribe(
        (inited) =>  {
          if (inited) {
            this.init();
          }
        }
      );
    });

    // subscribing to UoM changes so we can modify data
    this.settingsService.unitOfMeasure$.subscribe(() => {
      if (this.inited) {
        this.createLineCharts();
      }
    });
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  init() {
    this.fullJunctureByIdGQL.fetch({
      id: this.junctureId,
      userId: this.userService.user ? this.userService.user.id : null
    }).subscribe(({ data }) => {
      this.settingsService.modPageMeta(
        `Juncture ${data.junctureById.name}`,
        `Check out the posts, photos, and impressions that make up the juncture, ${data.junctureById.name}`
      );
      this.junctureData = data.junctureById;
      this.disqusId = `juncture/${this.junctureData.id}`;
      this.isGPX = this.junctureData.coordsByJunctureId.nodes.length ? true : false;

      // populate banner info
      this.flag = {
        code: this.junctureData.country.toLowerCase(),
        name: this.exploreService.countryCodeObj[this.junctureData.country].name
      };
      this.analyticsService.getPageViews().then(
        ({ views }) => {
          this.views = views;
        }
      );

      // fitting the map to the data layer OR the marker
      this.mapsAPILoader.load().then(() => {
        // coerce lat / lon to numbers
        this.markerLat = +this.junctureData.lat;
        this.markerLon = +this.junctureData.lon;

        if (this.isGPX) {
          this.latlngBounds = new window.google.maps.LatLngBounds();
          // take five coord pairs from the coords arr evenly spaced to hopefully encapsulate all the bounds
          const chosenCoords = [];
          const desiredNumberPairs = 5;
          for (
            let i = 0;
            i < this.junctureData.coordsByJunctureId.nodes.length && chosenCoords.length < desiredNumberPairs;
            i += Math.ceil(this.junctureData.coordsByJunctureId.nodes.length / desiredNumberPairs)
          ) {
            chosenCoords.push(this.junctureData.coordsByJunctureId.nodes[i]);
          }

          chosenCoords.forEach((pair) => {
            this.latlngBounds.extend(new window.google.maps.LatLng(pair.lat, pair.lon));
          });
        }

        // grab map style
        this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe((data) => {
          this.mapStyle = data;
        });
        this.dataLayerStyle = {
          clickable: false,
          strokeColor: this.settingsService.secondaryColor,
          strokeWeight: 3
        };
      });

      if (this.isGPX) {
        this.createLineCharts();
      }

      // find prior juncture + next juncture
      for (let i = 0; i < this.junctureData.tripByTripId.juncturesByTripId.nodes.length; i++) {
        if (this.junctureData.tripByTripId.juncturesByTripId.nodes[i].id === this.junctureData.id) {
          // set prior juncture
          if (i !== 0) {
            this.priorJuncture = this.junctureData.tripByTripId.juncturesByTripId.nodes[i - 1];
          } else {
            this.priorJuncture = null;
          }

          // set next juncture
          if (i !== this.junctureData.tripByTripId.juncturesByTripId.nodes.length - 1) {
            this.nextJuncture = this.junctureData.tripByTripId.juncturesByTripId.nodes[i + 1];
          } else {
            this.nextJuncture = null;
          }

          break;
        }
      }

      // populate banner
      if (!this.junctureData.imagesByJunctureId.nodes.length) {
        this.bannerImg = '../../assets/images/trip-default.jpg';
      } else {
        for (let i = 0; i < this.junctureData.imagesByJunctureId.nodes.length; i++ ) {
          if (!this.junctureData.imagesByJunctureId.nodes[i].postId) {
            this.bannerImg = this.junctureData.imagesByJunctureId.nodes[i].url;
            break;
          }
        }
      }

      this.inited = true;

      // resize since size changes depending on how data is
      if (this.map) {
        this.map.triggerResize();
      }
    });
  }

  clicked(clickEvent) {
    console.log(clickEvent);
  }

  createLineCharts() {
    this.geoJsonObject = this.geoService.generateGeoJSON([this.junctureData.coordsByJunctureId.nodes]);

    // take our generated geojson and process into arras for charts
    const gpxData = this.geoService.crunchGPXData(this.geoJsonObject);

    // We want roughly 80-120 points per graph to be mindful of performance / look.
    // Creating a filter number to arrive there
    // take number of data points and find reasonable divisor
    let filterDivisor;
    for (let i = 1; i < this.geoJsonObject.geometry.coordinates.length; i++) {
      if (this.geoJsonObject.geometry.coordinates.length / i < 120) {
        filterDivisor = i;
        break;
      }
    }

    // set up statistics
    this.stats = [
      {
        icon: 'walk-outline',
        iconColor: 'purple',
        label: 'Distance',
        value: this.settingsService.unitOfMeasure === 'metric'
          ? (gpxData.totalDistance / 1000).toFixed(2)
          : (gpxData.totalDistance).toFixed(2),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'kms' : 'miles'
      },
      {
        icon: 'time',
        iconColor: 'gold',
        label: 'Duration',
        value: this.utilService.msToTime(gpxData.stats.duration),
        unitOfMeasure: ''
      },
      {
        icon: 'speedometer',
        iconColor: 'silver',
        label: 'Average Speed',
        value: this.settingsService.unitOfMeasure === 'metric'
          ? gpxData.stats.avgSpeed.toFixed(2)
          : this.utilService.kmsToMiles(gpxData.stats.avgSpeed).toFixed(2),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'km/h' : 'mph'
      },
      {
        icon: 'flame',
        iconColor: 'red',
        label: 'Max Speed',
        value: this.settingsService.unitOfMeasure === 'metric'
          ? gpxData.stats.maxSpeed.toFixed(2)
          : this.utilService.kmsToMiles(gpxData.stats.maxSpeed).toFixed(2),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'km/h' : 'mph'
      },
      {
        icon: 'trending-up',
        iconColor: 'teal',
        label: 'Climbing Distance',
        value: this.settingsService.unitOfMeasure === 'metric'
          ? Math.round(gpxData.stats.climb)
          : Math.round(this.utilService.metersToFeet(gpxData.stats.climb)),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'm' : 'ft'
      },
      {
        icon: 'trending-down',
        iconColor: 'blue',
        label: 'Descent Distance',
        value: this.settingsService.unitOfMeasure === 'metric'
          ? Math.round(gpxData.stats.descent)
          : Math.round(this.utilService.metersToFeet(gpxData.stats.descent)),
        unitOfMeasure: this.settingsService.unitOfMeasure === 'metric' ? 'm' : 'ft'
      },
    ];

    // creating x and y coords for our various graohs and filtering down to our deemed appropriate number of data points
    const elevationTimeData = this.geoJsonObject.geometry.coordinates.map((coord, i) => ({
      x: gpxData.timeArr[i],
      y: this.settingsService.unitOfMeasure === 'metric'
        ? coord[2]
        : this.utilService.metersToFeet(coord[2])
    })).filter((_, i) => i % filterDivisor === 0);
    const speedTimeData = gpxData.speedsArr.map((speed, i) => ({
      x: gpxData.timeArr[i],
      y: speed
    })).filter((_, i) => i % filterDivisor === 0);
    const elevationDistanceData = this.geoJsonObject.geometry.coordinates.map((coord, i) => ({
      x: this.settingsService.unitOfMeasure === 'metric'
        ? gpxData.distanceArr[i] / 1000
        : gpxData.distanceArr[i],
      y: this.settingsService.unitOfMeasure === 'metric'
        ? coord[2]
        : this.utilService.metersToFeet(coord[2])
    })).filter((_, i) => i % filterDivisor === 0);
    const speedDistanceData = gpxData.speedsArr.map((speed, i) => ({
      x: this.settingsService.unitOfMeasure === 'metric'
        ? gpxData.distanceArr[i] / 1000
        : gpxData.distanceArr[i],
      y: speed
    })).filter((_, i) => i % filterDivisor === 0);

    this.distanceChartData = {
      datasets: [
        {
          label: 'Elevation',
          yAxisID: 'A',
          data: elevationDistanceData,
          backgroundColor: 'rgba(255,133,0,0.2)',
          borderColor: 'rgba(255,133,0,1)',
        }, {
          label: 'Speed',
          yAxisID: 'B',
          data: speedDistanceData,
          backgroundColor: 'rgba(0, 212, 255,0.2)',
          borderColor: 'rgba(0, 212, 255,1)',
        }
      ]
    };

    this.distanceChartOptions = {
      title: {
        display: true,
        text: 'Distance Chart'
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: `Distance (${this.settingsService.unitOfMeasure === 'metric' ? 'kms' : 'miles' })`
          },
          type: 'linear'
        }],
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: `Elevation (${this.settingsService.unitOfMeasure === 'metric' ? 'm' : 'ft' })`
          }
        }, {
          id: 'B',
          type: 'linear',
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: `Speed (${this.settingsService.unitOfMeasure === 'metric' ? 'km/h' : 'mi/h' })`
          }
        }]
      },
      events: ['click'],
      elements: {
        point: {
          radius: 0
        },
        line: {
          // tension: 0, // disables bezier curves
        }
      }
    };

    this.timeChartData = {
      datasets: [
        {
          label: 'Elevation',
          yAxisID: 'A',
          data: elevationTimeData,
          backgroundColor: 'rgba(255,133,0,0.2)',
          borderColor: 'rgba(255,133,0,1)',
        }, {
          label: 'Speed',
          yAxisID: 'B',
          data: speedTimeData,
          backgroundColor: 'rgba(0, 212, 255,0.2)',
          borderColor: 'rgba(0, 212, 255,1)',
        }
      ]
    };

    this.timeChartOptions = {
      title: {
        display: true,
        text: 'Time Chart'
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'HH:mm'
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: `Elevation (${this.settingsService.unitOfMeasure === 'metric' ? 'm' : 'ft' })`
          }
        }, {
          id: 'B',
          type: 'linear',
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: `Speed (${this.settingsService.unitOfMeasure === 'metric' ? 'km/h' : 'mi/h' })`
          }
        }]
      },
      events: ['click'],
      elements: {
        point: {
          radius: 0
        },
        line: {
          // tension: 0, // disables bezier curves
        }
      }
    };
  }

  async editJuncture() {
    const junctureId = this.junctureData.id;
    const modal = await this.modalCtrl.create({
      component: JunctureModalComponent,
      componentProps: { markerImg: this.junctureService.defaultMarkerImg, junctureId },
      cssClass: 'junctureModal',
      backdropDismiss: false
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.junctureService.handleOpenJunctureModal(data, junctureId);
  }
}

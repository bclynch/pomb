import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ENV } from '../../../environments/environment';

import { AppService } from '../../services/app.service';
import { SubscriptionLike } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-geo-chart',
  template: `
    <div>
      <div id="geoChart" [style.width]="this.mapWidth"></div>
    </div>
    `,
    styleUrls: ['./geoChart.component.scss']
})
export class GoogleChartComponent implements OnChanges, OnDestroy {
  private static googleLoaded: any;
  @Input() mapWidth = '900px';
  @Input() backgroundColor = 'white';
  @Input() datalessColor = 'grey';
  @Input() defaultColor = 'white';
  @Input() region: string = null;
  @Input() countries: string[];

  private options;
  private data;
  private chart;

  initSubscription: SubscriptionLike;

  constructor(
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

  // redraw map on data change
  ngOnChanges() {
    this.init();
  }

  getGoogle() {
      return google;
  }
  init() {
    if (!GoogleChartComponent.googleLoaded) {
      GoogleChartComponent.googleLoaded = true;
      google.charts.load('current',  {packages: ['geochart'], mapsApiKey: ENV.googleAPIKey});
    }
    google.charts.setOnLoadCallback(() => this.drawGraph());
  }

  drawGraph() {
    const self = this;
    // https://developers.google.com/chart/interactive/docs/gallery/geochart#continent-hierarchy-and-codes
    this.data = google.visualization.arrayToDataTable(this.countries);

    this.options = {
      region: this.region,
      datalessRegionColor: this.datalessColor,
      defaultColor: this.defaultColor,
      displayMode: 'regions',
      keepAspectRatio: true,
      backgroundColor: this.backgroundColor
    };

    this.chart = this.createBarChart(document.getElementById('geoChart'));

    google.visualization.events.addListener(this.chart, 'regionClick', myPageEventHandler);
    function myPageEventHandler(e) {
      // console.log(e);
      // // if its not a region code we know its a country code
      // if (Object.keys(self.exploreService.googleRegionCodes).indexOf(e.region) === -1) {
      //   self.routerService.navigateToPage(`/explore/country/${self.utilService.formatForURLString(self.exploreService.countryCodeObj[e.region].name)}`);
      // } else {
      //   self.routerService.navigateToPage(`/explore/region/${self.utilService.formatForURLString(self.exploreService.googleRegionCodes[e.region])}`);
      // }
    }
    this.chart.draw(this.data, this.options);
  }

  createBarChart(element: any): any {
    return new google.visualization.GeoChart(element);
  }
}

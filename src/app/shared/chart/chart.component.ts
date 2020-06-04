import { Component, Input, Output, EventEmitter,  ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import Chart from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnChanges, AfterViewInit {
  @ViewChild('chart') chart: any;
  @Input() chartData: any;
  @Input() chartOptions: any;
  @Input() type: any;
  @Input() height = 'auto';
  @Input() width = '100%';

  @Output() dataURL: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  renderCharts() {
    if (this.chart) {
      const chartCtx = this.chart.nativeElement.getContext('2d');

      const chart = new Chart(chartCtx, {
        type: this.type,
        data: this.chartData,
        options: this.chartOptions
      });

      // this.dataURL.emit( chart.legend.ctx.canvas.toDataURL('image/png') ); // handy for PDF output
    }
  }

  ngAfterViewInit() {
    this.renderCharts();
  }

  ngOnChanges() {
    this.renderCharts();
  }
}

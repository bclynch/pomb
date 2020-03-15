import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AnalyticsService } from './services/analytics.service';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  firstTry = true;

  constructor(
    private anaylticsService: AnalyticsService,
    private toastCtrl: ToastController,
    private appService: AppService
  ) {
    this.appService.appInit();
  }

  // analytics tracking
  ngOnInit() {
    this.anaylticsService.trackViews();

    // listen to the service worker promise in index.html to see if there has been a new update.
    // condition: the service-worker.js needs to have some kind of change - e.g. increment CACHE_VERSION.
    window['isUpdateAvailable']
    .then(isAvailable => {
      if (isAvailable) {
        this.toast();
      }
    });
  }

  ngOnDestroy() {
    this.anaylticsService.destroyTracking();
  }

  async toast() {
    const toast = await this.toastCtrl.create({
      message: 'New updates available! Reload Pack On My Back to see the latest.',
      position: 'bottom',
      buttons: [
        {
          text: 'Reload',
          role: 'cancel',
          handler: () => {
            window.location.reload();
          }
        }
      ]
    });

    toast.present();
  }
}

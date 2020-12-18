import { Component, OnDestroy } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';

import { SettingsService } from '../../../../services/settings.service';
import { AppService } from '../../../../services/app.service';

import { GradientPopoverComponent } from '../../../gradientPopover/gradientPopover/gradientPopover.component';
import { ImageUploaderPopoverComponent } from '../../../imageUploader/imageUploader/imageUploaderPopover.component';
import { SubscriptionLike } from 'rxjs';
import { UpdateConfigGQL } from '../../../../generated/graphql';

@Component({
  selector: 'page-admin-config',
  templateUrl: 'config.html',
  styleUrls: ['./config.scss']
})
export class AdminConfigPage implements OnDestroy {

  styleModel = { primaryColor: null, secondaryColor: null, tagline: null, heroBanner: null };

  initSubscription: SubscriptionLike;

  constructor(
    private appService: AppService,
    private settingsService: SettingsService,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private updateConfigGQL: UpdateConfigGQL
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

  init() {
    this.styleModel.primaryColor = this.settingsService.primaryColor;
    this.styleModel.secondaryColor = this.settingsService.secondaryColor;
    this.styleModel.tagline = this.settingsService.tagline;
    this.styleModel.heroBanner = this.settingsService.heroBanner;
  }

  async presentGradientPopover() {
    const popover = await this.popoverCtrl.create({
      component: GradientPopoverComponent,
      cssClass: 'gradientPopover',
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      this.styleModel.primaryColor = data.primaryColor;
      this.styleModel.secondaryColor = data.secondaryColor;
    }
  }

  async presentImageUploaderPopover() {
    const popover = await this.popoverCtrl.create({
      component: ImageUploaderPopoverComponent,
      componentProps: { type: 'banner', size: { width: 1200, height: 300 } },
      cssClass: 'imageUploaderPopover',
      backdropDismiss: false
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      this.styleModel.heroBanner = data[0].url;
    }
  }

  updateStyle() {
    this.updateConfigGQL.mutate({ ...this.styleModel }).subscribe(
      async () => {
        this.settingsService.primaryColor = this.styleModel.primaryColor;
        this.settingsService.secondaryColor = this.styleModel.secondaryColor;
        this.settingsService.tagline = this.styleModel.tagline;
        this.settingsService.heroBanner = this.styleModel.heroBanner;

        const toast = await this.toastCtrl.create({
          message: `New site settings saved`,
          duration: 3000,
          position: 'top'
        });

        toast.present();
      });
  }
}

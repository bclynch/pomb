import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

import { ExpandedModal } from '../gallery/expandedModal/expandedModal.component';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html'
})
export class Grid {
  @Input() gridConfig: number[];
  @Input() elements = [];
  @Input() isPost = true;

  constructor(
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private modalController: ModalController
  ) { }

  async openCarousel(i: number) {
    const modal = await this.modalController.create({
      component: ExpandedModal,
      componentProps: { data: this.settingsService.recentPhotos, index: i },
      cssClass: 'expandedModal'
    });
    await modal.present();
  }
}

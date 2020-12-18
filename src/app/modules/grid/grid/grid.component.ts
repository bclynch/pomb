import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

import { ExpandedModalComponent } from '../../../modules/gallery/gallery/expandedModal/expandedModal.component';

import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  @Input() gridConfig: number[];
  @Input() elements = [];
  @Input() isPost = true;

  constructor(
    public settingsService: SettingsService,
    public sanitizer: DomSanitizer,
    private modalController: ModalController
  ) { }

  async openCarousel(i: number) {
    const modal = await this.modalController.create({
      component: ExpandedModalComponent,
      componentProps: { data: this.settingsService.recentPhotos, index: i },
      cssClass: 'expandedModal'
    });
    await modal.present();
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { GalleryPhoto } from '../../models/GalleryPhoto.model';
import { ExpandedModal } from './expandedModal/expandedModal.component';

@Component({
  selector: 'app-gallery',
  templateUrl: 'gallery.component.html'
})
export class Gallery {
  @Input() data: GalleryPhoto[];
  @Input() gutterWidth = '5px';
  @Input() perRow: number;
  @Input() isSquare = false;

  constructor(
    private modalController: ModalController
  ) { }

  async expandCarousel(i: number) {
    const modal = await this.modalController.create({
      component: ExpandedModal,
      componentProps: { data: this.data, index: i }, 
      cssClass: 'expandedModal'
    });
  
    await modal.present();
  }
}

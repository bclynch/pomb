import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { GalleryPhoto } from '../../../models/GalleryPhoto.model';
import { ExpandedModalComponent } from './expandedModal/expandedModal.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  @Input() data: GalleryPhoto[];
  @Input() gutterWidth = '5px';
  @Input() perRow: number;
  @Input() isSquare = false;

  constructor(
    private modalController: ModalController
  ) { }

  async expandCarousel(i: number) {
    const modal = await this.modalController.create({
      component: ExpandedModalComponent,
      componentProps: { data: this.data, index: i },
      cssClass: 'expandedModal'
    });

    await modal.present();
  }
}

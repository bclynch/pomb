import { Component } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

import { GalleryPhoto } from '../../../models/GalleryPhoto.model';

@Component({
  selector: 'app-gallery-img-action-popover',
  templateUrl: './galleryImgActionPopover.component.html',
  styleUrls: ['./galleryImgActionPopover.component.scss']
})
export class GalleryImgActionPopoverComponent {

  popoverModel: GalleryPhoto;

  constructor(
    public popoverCtrl: PopoverController,
    private params: NavParams
  ) {
    this.popoverModel = { ...params.get('model') };
  }

  dismissPopover(action: string) {
    const data = { action, data: this.popoverModel };
    this.popoverCtrl.dismiss(data);
  }
}

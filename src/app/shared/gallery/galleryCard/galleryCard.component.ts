import { Component, Input } from '@angular/core';
import { GalleryPhoto } from '../../../models/GalleryPhoto.model';

@Component({
  selector: 'app-gallery-card',
  templateUrl: './galleryCard.component.html',
  styleUrls: ['./galleryCard.component.scss']
})
export class GalleryCardComponent {
  @Input() cardData: GalleryPhoto;
  @Input() isSquare: boolean;

  constructor() {}

}

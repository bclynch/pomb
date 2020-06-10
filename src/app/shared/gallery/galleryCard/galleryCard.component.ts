import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gallery-card',
  templateUrl: './galleryCard.component.html',
  styleUrls: ['./galleryCard.component.scss']
})
export class GalleryCardComponent {
  @Input() cardData;
  @Input() isSquare: boolean;

  constructor() {}

}

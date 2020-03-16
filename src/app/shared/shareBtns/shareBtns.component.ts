import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-btns',
  templateUrl: 'shareBtns.component.html'
})
export class ShareBtnsComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() justIcons = false;
  @Input() size = -1;

  address = window.location.href;

  constructor() { }

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-btns',
  templateUrl: 'shareBtns.component.html',
  styleUrls: ['./shareBtns.component.scss']
})
export class ShareBtnsComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() size = -1;
  @Input() justIcons = false;

  address = window.location.href;

  constructor() { }

}

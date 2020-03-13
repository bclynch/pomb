import { Component, Input } from '@angular/core';
import { Juncture } from '../../models/Juncture.model';

@Component({
  selector: 'app-juncture-bubbles',
  templateUrl: './junctureBubbles.component.html',
  styleUrls: ['./junctureBubbles.component.scss']
})
export class JunctureBubblesComponent {
  @Input() junctures: Juncture[];

  constructor() { }

}

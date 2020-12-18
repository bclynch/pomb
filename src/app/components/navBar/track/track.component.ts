import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-track-icon',
  templateUrl: 'track.component.html'
})
export class TrackIconComponent {
  @Input() color = 'white';
  @Input() height = '50px';
  @Input() width = '50px';

  constructor() { }

}

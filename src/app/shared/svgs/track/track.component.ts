import { Component, Input } from '@angular/core';

@Component({
  selector: 'TrackIcon',
  templateUrl: 'track.component.html'
})
export class TrackIconComponent {
  @Input() color = 'white';

  constructor() { }

}

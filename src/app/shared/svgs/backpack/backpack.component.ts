import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-backpack-icon',
  templateUrl: 'backpack.component.html'
})
export class BackpackIconComponent {
  @Input() color = 'black';
  @Input() height = '80px';
  @Input() width = '80px';

  constructor() { }

}

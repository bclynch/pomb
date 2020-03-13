import { Component, Input } from '@angular/core';

import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-page-wrapper',
  templateUrl: './pageWrapper.component.html',
  styleUrls: ['./pageWrapper.component.scss']
})
export class PageWrapperComponent {
  @Input() backgroundColor = 'white';
  @Input() displayNavLogo = true;
  @Input() displayHeroBanner = false;
  @Input() displayFooter = true;
  @Input() displayNav = true;
  @Input() collapsibleNav = true;
  @Input() topo = false;

  constructor(
    private utilService: UtilService
  ) {
    // want nav always there on page init to start
    this.utilService.scrollDirection = 'up';
  }

}

import { Component } from '@angular/core';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent {
  activeTab: 'terms' | 'privacy';

  constructor(
    private routerService: RouterService
  ) {
    this.activeTab = this.routerService.fragment || 'terms';
  }

  changeTab(tab: 'terms' | 'privacy') {
    this.routerService.modifyFragment(tab);
    this.activeTab = tab;
  }
}

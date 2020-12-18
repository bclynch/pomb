import { Component, Input } from '@angular/core';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';
import { ExploreService } from '../../../../services/explore.service';
import { UtilService } from '../../../../services/util.service';

interface Social {
  icon: string;
  url: string;
  label: string;
}

@Component({
  selector: 'app-explore-nav-section',
  templateUrl: './exploreSection.component.html',
  styleUrls: ['./exploreSection.component.scss']
})
export class ExploreNavSectionComponent {

  constructor(
    public settingsService: SettingsService,
    private routerService: RouterService,
    public exploreService: ExploreService,
    private utilService: UtilService
  ) {}

  navigateToRegion(region: string) {
    this.routerService.navigateToPage(`/explore/region/${region}`);
  }
  navigateToSubRegion(region: string, subregion: string) {
    this.routerService.navigateToPage(`/explore/region/${region}/${this.utilService.formatForURLString(subregion)}`);
  }
}

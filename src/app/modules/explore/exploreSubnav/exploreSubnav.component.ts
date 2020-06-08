import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SettingsService } from '../../../services/settings.service';
import { RouterService } from '../../../services/router.service';
import { ExploreService } from '../../../services/explore.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'ExploreSubnav',
  templateUrl: 'exploreSubnav.component.html',
  styleUrls: ['./exploreSubnav.component.scss']
})
export class ExploreSubnavComponent {
  @Input() options: string[];
  @Input() country: string[];
  @Output() optionSelect = new EventEmitter<string>();

  constructor(
    public settingsService: SettingsService,
    private routerService: RouterService,
    public exploreService: ExploreService,
    private utilService: UtilService
  ) {

  }

  navigateSubOption(option: string) {
    const optionFormatted = this.utilService.formatForURLString(option);
    this.routerService.modifyFragment(optionFormatted);
    this.optionSelect.emit(optionFormatted);
  }
}

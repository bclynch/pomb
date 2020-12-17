import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'app-unit-toggle',
  templateUrl: 'unitToggle.component.html',
  styleUrls: ['./unitToggle.component.scss']
})
export class UnitToggleComponent {

  selected: 'imperial' | 'metric';

  constructor(
    public settingsService: SettingsService,
    private localStorageService: LocalStorageService,
    public sanitizer: DomSanitizer
  ) {
    this.selected = this.settingsService.unitOfMeasure;
  }

  onToggleChange(selection: 'imperial' | 'metric') {
    if (selection !== this.selected) {
      this.selected = selection;
      this.settingsService.changeUnitOfMeasure(selection);
      this.localStorageService.set('unitOfMeasure', selection);
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../../services/settings.service';

interface Guide {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-place-guide',
  templateUrl: 'placeGuide.component.html',
  styleUrls: ['./placeGuide.component.scss']
})
export class PlaceGuideComponent implements OnInit {
  @Input() selectedOptions: string[];

  guides: Guide[] = [];
  options = {
    visa: {
      name: 'Visas',
      icon: 'document-attach-outline',
      description: 'Information you need to know for getting in and out of the country without issue'
    },
    climate: {
      name: 'Climate',
      icon: 'partly-sunny-outline',
      description: 'Know what to expect the weather to be when you go'
    },
    money: {
      name: 'Money and Costs',
      icon: 'cash-outline',
      description: 'Currency and budget information so your wallet is as ready as you are'
    }
  };

  constructor(
    public sanitizer: DomSanitizer,
    public settingsService: SettingsService
  ) {

  }

  ngOnInit() {
    this.selectedOptions.forEach((option) => {
      this.guides.push(this.options[option]);
    });
  }

}

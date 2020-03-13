import { Component, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';

interface Social {
  icon: string;
  url: string;
  label: string;
}

@Component({
  selector: 'app-community-nav-section',
  templateUrl: './communitySection.component.html',
  styleUrls: ['./communitySection.component.scss']
})
export class CommunityNavSectionComponent {
  @Input() socialOptions: Social;

  gridConfiguration: number[] = [ 6.5, 3.5, 3, 3, 3 ];

  constructor(
    public settingsService: SettingsService
  ) {}

}

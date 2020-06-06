import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';


@Component({
  selector: 'app-tags',
  templateUrl: 'tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() tags: string[];

  constructor(
    public routerService: RouterService,
    public sanitizer: DomSanitizer,
    public settingsService: SettingsService,
  ) { }

}

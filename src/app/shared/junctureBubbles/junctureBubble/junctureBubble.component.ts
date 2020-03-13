import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from '../../../services/settings.service';
import { JunctureService } from '../../../services/juncture.service';
import { RouterService } from '../../../services/router.service';
import { Juncture } from '../../../models/Juncture.model';

@Component({
  selector: 'app-juncture-bubble',
  templateUrl: './junctureBubble.component.html',
  styleUrls: ['./junctureBubble.component.scss']
})
export class JunctureBubbleComponent {
  @Input() juncture: Juncture;

  constructor(
    public settingsService: SettingsService,
    public sanitizer: DomSanitizer,
    private junctureService: JunctureService,
    public routerService: RouterService
  ) { }

  junctureImage(juncture) {
    return juncture.markerImg || this.junctureService.defaultMarkerImg;
  }
}

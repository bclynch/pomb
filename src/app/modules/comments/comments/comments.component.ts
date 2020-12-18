import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  @Input() disqusId: string;

  loadComments = false;

  constructor(
    public sanitizer: DomSanitizer,
    public settingsService: SettingsService
  ) { }

}

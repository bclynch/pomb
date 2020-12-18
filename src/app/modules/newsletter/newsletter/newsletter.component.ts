import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../../services/settings.service';
import { AlertService } from '../../../services/alert.service';
import { CreateEmailListEntryGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
  @Input() callout = 'Want POMB\'s email newsletter?';

  emailAddress: string;
  isValid = true;

  constructor(
    public settingsService: SettingsService,
    private alertService: AlertService,
    public sanitizer: DomSanitizer,
    private createEmailListEntryGQL: CreateEmailListEntryGQL
  ) { }

  onFormSubmit(e) {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (emailRegex.test(e.target[0].value)) {
      this.createEmailListEntryGQL.mutate({
        email: e.target[0].value
      }).subscribe(
        () => this.alertService.alert('Pack On My Back', 'Thanks for subscribing!'),
        () => this.alertService.alert(
          'Pack On My Back',
          'Looks like you\'ve already shared your email with us, thanks!'
        )
      );
      this.emailAddress = '';
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }
}

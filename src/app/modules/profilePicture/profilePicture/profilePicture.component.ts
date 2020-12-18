import { Component, Input } from '@angular/core';

import { SettingsService } from '../../../services/settings.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profilePicture.component.html',
  styleUrls: ['./profilePicture.component.scss']
})
export class ProfilePictureComponent {
  @Input() photo: string;
  @Input() trackUserId: number;

  constructor(
    public settingsService: SettingsService,
    public userService: UserService
  ) { }

}

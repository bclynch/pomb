import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { UserService } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registrationModal.html',
  styleUrls: ['./registrationModal.scss']
})
export class RegistrationModalComponent {
  isRegister = false;
  registrationModel = { username: '', firstName: '', lastName: '', email: '', password: '', confirm: '' };
  loginModel = { email: '', password: '' };

  constructor(
    public modalCtrl: ModalController,
    public userService: UserService,
    private params: NavParams,
    public settingsService: SettingsService,
    private routerService: RouterService
  ) {
    if (this.params.data.isRegister) {
      this.isRegister = true;
    }
  }

  onCloseModal() {
    this.modalCtrl.dismiss();
  }

  toggleView() {
    this.isRegister = !this.isRegister;
  }

  navigate(link: string) {
    this.modalCtrl.dismiss();
    this.routerService.modifyFragment(link, '/terms');
  }
}

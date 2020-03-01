import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavParams, ModalController } from '@ionic/angular';
import {Apollo} from 'apollo-angular';

import { APIService } from '../../services/api.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { UserService } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'RegistrationModal',
  templateUrl: 'registrationModal.html'
})
export class RegistrationModal {
  isRegister = false;
  registrationModel = { username: '', firstName: '', lastName: '', email: '', password: '', confirm: '' };
  loginModel = { email: '', password: '' };

  constructor(
    public modalCtrl: ModalController,
    private apiService: APIService,
    private apollo: Apollo,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private params: NavParams,
    private router: Router,
    private settingsService: SettingsService,
    private routerService: RouterService
  ) {
    if (this.params.data.isRegister) this.isRegister = true;
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

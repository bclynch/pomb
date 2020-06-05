import { Component } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { AppService } from '../../../services/app.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'page-admin-login',
  templateUrl: 'admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginPage {

  loginModel = { email: null, password: null };

  initSubscription: SubscriptionLike;

  constructor(
    private appService: AppService,
    public userService: UserService
  ) {
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.init();
        }
      }
    );
  }

  init() {

  }
}

import { Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { AppService } from '../../../services/app.service';

import { RegistrationModalComponent } from '../../../shared/registrationModal/registrationModal';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnDestroy {
  features = [
    {
      icon: 'md-map',
      title: 'Chart Your Journey Faster',
      description: `Monitor your travels with our gps plotting and visualization tools.
        Make your trip come alive with in depth statistics and beautiful visuals to show off to
        your friends and look back on in the future.`
    },
    {
      icon: 'md-albums',
      title: 'Get Creative',
      description: `Carve your own path and manage your memories with our blog management system
      software. Customize the look and feel of your entries and how you share your own story
      with the rest of the world.`
    },
    {
      icon: 'md-compass',
      title: 'Stay Connected',
      description: `Take the stress out of keeping friends and family in the loop. Pack On My Back
      makes it easy to stay connected with its family of tools to track and share life\'s best moments.`
    }
  ];

  registrationModel = { username: '', firstName: '', lastName: '', email: '', password: '' };

  initSubscription: SubscriptionLike;

  constructor(
    public userService: UserService,
    private modalCtrl: ModalController,
    public router: Router,
    private settingsService: SettingsService,
    private appService: AppService
  ) {
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.init();
        }
      }
    );
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  init() {
    // console.log(this.userService.signedIn);
    // if (this.userService.signedIn) {
    //   console.log('authenticated');
    //   this.router.navigateByUrl('/stories');
    // }
    this.settingsService.modPageMeta(
      'Travel Tracking, Blogging, and Sharing Made Easy',
      `Log and share your memories with Pack On My Back. Sophisticated, yet easy to
        use tools make plotting your journey, writing a blog, and visualizing your trip easy.
        Make your experiences last a lifetime.`
    );
  }

  async registerUser() {
    const modal = await this.modalCtrl.create({
      component: RegistrationModalComponent,
      componentProps: { isRegister: true },
      cssClass: 'registrationModal'
    });

    await modal.present();
  }
}

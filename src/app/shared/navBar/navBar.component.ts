import { Component, Input, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { RegistrationModalComponent } from '../registrationModal/registrationModal';
import { MobileNavModalComponent } from '../mobileNavModal/mobileNavModal';

import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';
import { UserService } from '../../services/user.service';
import { ExploreService } from '../../services/explore.service';
import { UtilService } from '../../services/util.service';
import { AlertService } from '../../services/alert.service';
import { TripService } from '../../services/trip.service';
import { JunctureService } from '../../services/juncture.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from 'src/app/services/app.service';

interface Social {
  icon: string;
  url: string;
  label: string;
}

interface Section {
  label: string;
  value: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.scss']
})
export class NavBarComponent implements OnDestroy {
  @Input() collapsibleNav: boolean;

  socialOptions: Social[] = [
    { icon: 'logo-instagram', url: 'https://www.instagram.com/bclynch7/', label: 'instagram' },
    { icon: 'logo-facebook', url: 'https://www.facebook.com/brendan.lynch.90', label: 'facebook' },
    { icon: 'logo-github', url: 'https://github.com/bclynch', label: 'github' },
  ];

  sectionOptions: Section[] = [];
  isExpanded = false; // set to true for testing
  activeSection: Section;

  searchActive = false;

  regions;

  initSubscription: SubscriptionLike;

  constructor(
    private settingsService: SettingsService,
    private routerService: RouterService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private exploreService: ExploreService,
    private utilService: UtilService,
    private sanitizer: DomSanitizer,
    private alertService: AlertService,
    private tripService: TripService,
    private junctureService: JunctureService,
    private appService: AppService
  ) {
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.snagCategories();
        }
      }
    );
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  snagCategories() {
    this.sectionOptions = [];
    Object.keys(this.settingsService.siteSections).forEach((category) => {
      this.sectionOptions.push({ label: category, value: category.toLowerCase() });
    });
    // this.activeSection = this.sectionOptions[2];
  }

  navigate(path: string) {
    if (path === 'my pack') {
      if (this.userService.user) {
        this.routerService.navigateToPage(`/user/${this.userService.user.username}`);
      } else {
        this.alertService.alert('Notification', 'Must login or create an account before vising your profile page');
      }
    } else {
      this.routerService.navigateToPage(`/${path}`);
    }
  }

  async signinUser() {
    const modal = await this.modalCtrl.create({
      component: RegistrationModalComponent,
      cssClass: 'registrationModal'
    });
    return await modal.present();
  }

  openSearch() {
    this.searchActive = !this.searchActive;
  }

  navHover(e, i: number) {
    if (e.type === 'mouseenter') {
      this.isExpanded = true;
      this.activeSection = this.sectionOptions[i];
    } else {
      this.isExpanded = false;
      this.activeSection = null;
    }
  }

  async openMobileNav() {
    const modal = await this.modalCtrl.create({
      component: MobileNavModalComponent,
      cssClass: 'mobileNavModal',
      backdropDismiss: false
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      switch (data.toLowerCase()) {
        case 'community hub':
          this.routerService.navigateToPage('/community');
          break;
        case 'featured trip':
          this.routerService.navigateToPage(`/trip/${this.settingsService.featuredTrip.id}`);
          break;
        case 'stories hub':
          this.routerService.navigateToPage('/stories');
          break;
        case 'create trip':
          this.tripService.openTripModal(null);
          break;
        case 'create juncture':
          this.junctureService.openJunctureModal(null);
          break;
        case 'blog dashboard':
          this.routerService.navigateToPage(`/user/post-dashboard`);
          break;
        case 'user dashboard':
          this.routerService.navigateToPage(`/user/admin`);
          break;
        case 'register':
          this.signinUser();
          break;
        case 'profile':
          this.routerService.navigateToPage(`/user/${this.userService.user.username}`);
          break;
        case 'home':
          this.routerService.navigateToPage('/');
          break;
        case 'tracking':
          this.routerService.navigateToPage('/tracking');
          break;
        default:
          this.routerService.navigateToPage(`/stories/${data}`);
          break;
      }
    }
  }
}

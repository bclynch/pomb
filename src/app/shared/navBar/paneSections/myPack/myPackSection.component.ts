import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { RegistrationModalComponent } from '../../../registrationModal/registrationModal';
import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';
import { UserService } from '../../../../services/user.service';
import { JunctureService } from '../../../../services/juncture.service';
import { TripService } from '../../../../services/trip.service';

@Component({
  selector: 'app-my-pack-nav-section',
  templateUrl: './myPackSection.component.html',
  styleUrls: ['./myPackSection.component.scss']
})
export class MyPackNavSectionComponent {

  quickLinks = [
    { label: 'Create Trip', value: 'trip', icon: 'plane' },
    { label: 'Juncture Check-In', value: 'checkIn', icon: 'git-merge' },
    { label: 'Blog Dashboard', value: 'blog', icon: 'filing' },
    { label: 'Tracking', value: 'tracking', icon: 'track', custom: true },
    { label: 'User Dashboard', value: 'settings', icon: 'settings' }
  ];

  benefits = [
    {
      icon: 'locate',
      description: 'Chart and monitor your journey with our gps plotting and visualization tools. Make your trip come alive with in depth statistics and beautiful visuals to show off to your friends and look back on in the future.'
    },
    {
      icon: 'create',
      description: 'Carve your own path and manage your memories with our blog management system software. Customize the look and feel of your entries and how you share your own story with the rest of the world.' 
    },
    {
      icon: 'globe',
      description: 'Join our community of travel and outdoor enthusiasts to gain valuable insight and knowledge on potential outings and excursions around the globe. Learn what it takes to make your dreams come alive and inspire others along the way.'
    },
    {
      icon: 'compass',
      description: 'Take the stress out of keeping friends and family in the loop. Pack On My Back makes it easy to stay connected with its family of tools to track and share life\'s best moments.'
    }
  ];

  user;

  constructor(
    public settingsService: SettingsService,
    public routerService: RouterService,
    public userService: UserService,
    private modalCtrl: ModalController,
    private junctureService: JunctureService,
    private tripService: TripService,
    public sanitizer: DomSanitizer,
  ) {  }

  navigate(path: string) {
    switch (path) {
      case 'blog':
        this.routerService.navigateToPage(`/user/post-dashboard`);
        break;
      case 'settings':
        this.routerService.navigateToPage(`/user/admin`);
        break;
      case 'checkIn':
        this.junctureService.openJunctureModal(null);
        break;
      case 'trip':
        this.tripService.openTripModal(null);
        break;
      default:
      this.routerService.navigateToPage(`/${path}`);
    }
  }

  logout() {
    this.userService.logoutUser();
  }

  async signinUser() {
    const modal = await this.modalCtrl.create({
      component: RegistrationModalComponent,
      cssClass: 'registrationModal'
    });
    await modal.present();
  }
}

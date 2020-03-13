import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';

interface Section {
  label: string;
  value: string;
}

@Component({
  selector: 'MobileNavModal',
  templateUrl: './mobileNavModal.html',
  styleUrls: ['./mobileNavModal.scss']
})
export class MobileNavModalComponent {

  modalData;
  sectionOptions: Section[] = [];
  activeSection: number;
  subSections: any = {};

  constructor(
    public modalCtrl: ModalController,
    private params: NavParams,
    private settingsService: SettingsService,
    public sanitizer: DomSanitizer,
    public userService: UserService
  ) {
    this.snagCategories();
  }

  dismiss(type: string) {
    this.modalCtrl.dismiss(type);
  }

  snagCategories() {
    Object.keys(this.settingsService.siteSections).forEach((category) => {
      this.sectionOptions.push({ label: category, value: category.toLowerCase() });

      // populate subSections
      if (category === 'Stories') {
        this.subSections[category] = this.settingsService.siteSections[category].subSections.map((section) => {
          return section.charAt(0).toUpperCase() + section.slice(1);
        });
        this.subSections[category].unshift('Stories Hub');
      } else {
        this.subSections[category] = this.settingsService.siteSections[category].subSections;
      }
    });
  }

  logout(e) {
    e.stopPropagation();

    this.modalCtrl.dismiss();
    this.userService.logoutUser();
  }
}

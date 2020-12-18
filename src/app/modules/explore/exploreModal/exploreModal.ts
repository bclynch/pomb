import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { APIService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'ExploreModal',
  templateUrl: 'exploreModal.html',
  styleUrls: ['./exploreModal.scss']
})
export class ExploreModalComponent {

  modalData;

  constructor(
    public viewCtrl: ModalController,
    private apiService: APIService,
    private params: NavParams,
    public settingsService: SettingsService,
    private utilService: UtilService,
    public sanitizer: DomSanitizer,
    private routerService: RouterService
  ) {
    this.modalData = this.params.data.data.map((section) => {
      return {
        label: section.label,
        top: section.items.slice(0, 3).map((place) => ({ label: place, img: null })),
        other: section.items.slice(3)
      };
    });

    // fetch imgs for 'top' content
    this.modalData.forEach((section, sectionIndex) => {
      section.top.forEach((place, placeIndex) => {
        // grab flickr images for the modal
        this.apiService.getFlickrPhotos(this.utilService.formatURLString(place.label), 'landscape', 1).subscribe(
          ({ photos }: any) => {
            const { farm, server, id, secret } = photos.photo[0];
            // using square photo size 75 x 75
            this.modalData[sectionIndex].top[placeIndex].img =
              `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_s.jpg`;
          }
        );
      });
    });
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  navigate(place: string, type: string) {
    switch (type) {
      case 'Popular Regions':
        this.routerService.navigateToPage(`/explore/region/${this.utilService.formatForURLString(place)}`);
        break;
      case 'Popular Countries':
        this.routerService.navigateToPage(`/explore/country/${this.utilService.formatForURLString(place)}`);
        break;
      case 'Popular Cities':
        this.viewCtrl.dismiss(place);
        return;
    }

    this.viewCtrl.dismiss();
  }
}

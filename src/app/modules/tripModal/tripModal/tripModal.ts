import { Component } from '@angular/core';
import { NavParams, PopoverController, ModalController, ToastController } from '@ionic/angular';
import { TripByIdGQL, DeleteImageByIdGQL, DeleteTripByIdGQL } from '../../../generated/graphql';
import { UserService } from '../../../services/user.service';
import { UtilService } from '../../../services/util.service';
import { AlertService } from '../../../services/alert.service';
import { JunctureService } from '../../../services/juncture.service';

import { DatePickerModalComponent } from '../../datepickerModal/datepickerModal/datepickerModal';
import { ImageUploaderPopoverComponent } from '../../imageUploader/imageUploader/imageUploaderPopover.component';
import { GalleryImgActionPopoverComponent } from '../../galleryImgActionPopover/galleryImgAction/galleryImgActionPopover.component';

@Component({
  selector: 'app-trip-modal',
  templateUrl: './tripModal.html',
  styleUrls: ['./tripModal.scss']
})
export class TripModalComponent {

  editorOptions = {
    placeholderText: 'Write something insightful...',
    heightMin: '300px',
    heightMax: '525px',
    toolbarButtons: [
      'fullscreen',
      'bold',
      'italic',
      'underline',
      '|',
      'fontFamily',
      'fontSize',
      'paragraphFormat',
      'align',
      'formatOL',
      'formatUL',
      'indent', '|',
      'specialCharacters',
      'selectAll',
      'clearFormatting',
      'html',
      '|',
      'undo',
      'redo'
    ]
  };
  tripModel = {
    name: '',
    timeStart: Date.now(),
    timeEnd: null,
    description: '',
    bannerImages: [],
    photoHasChanged: []
  };

  inited = false;
  coords = { lat: null, lon: null };
  mapStyle;
  zoomLevel = 12;

  constructor(
    private userService: UserService,
    public params: NavParams,
    private utilService: UtilService,
    private popoverCtrl: PopoverController,
    private alertService: AlertService,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public junctureService: JunctureService,
    private tripByIdGQL: TripByIdGQL,
    private deleteImageByIdGQL: DeleteImageByIdGQL,
    private deleteTripByIdGQL: DeleteTripByIdGQL
  ) {
    // grab existing trip if it exists
    if (this.params.data.tripId) {
      this.tripByIdGQL.fetch({
        id: this.params.data.tripId,
        userId: this.userService.user.id
      }).subscribe(
        result => {
          // console.log(result);
          const tripData = result.data.tripById;
          // populate model
          this.tripModel.name = tripData.name;
          this.tripModel.timeStart = +tripData.startDate;
          this.tripModel.timeEnd = tripData.endDate ? +tripData.endDate : null;
          this.tripModel.description = tripData.description;
          // TODO fix -- broken on migration to new structure
          // this.tripModel.bannerImages = tripData.imagesByTripId.nodes;
          this.coords.lat = +tripData.startLat;
          this.coords.lon = +tripData.startLon;
          this.grabMapStyle();
        }
      );
    } else {
      // grab location for map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location: any) => {
          this.coords.lat = location.coords.latitude;
          this.coords.lon = location.coords.longitude;
          this.grabMapStyle();
        });
      }
    }
  }

  grabMapStyle() {
    this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe((data) => {
      this.mapStyle = data;
      this.inited = true;
    });
  }

  async presentDatepickerModal(e: Event, isStart) {
    e.stopPropagation();

    const modal = await this.modalCtrl.create({
      component: DatePickerModalComponent,
      componentProps: { date: isStart ? this.tripModel.timeStart : this.tripModel.timeEnd || Date.now() },
      cssClass: 'datepickerModal'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      if (isStart) {
        this.tripModel.timeStart = Date.parse(data);
      } else {
        this.tripModel.timeEnd = Date.parse(data);
      }
    }
  }

  saveTrip() {
    if (!this.tripModel.name) {
      this.alertService.alert('Missing Information', 'Please enter a name for your trip and try to save again.');
    } else if (this.tripModel.timeEnd && this.tripModel.timeEnd < this.tripModel.timeStart) {
      this.alertService.alert(
        'Save Issue',
        'Please check your start and end dates. End date cannot be after your start date.'
      );
    } else {
      this.modalCtrl.dismiss({
        ...this.tripModel,
        isExisting: !!(this.params.data.tripId),
        startLat: this.coords.lat,
        startLon: this.coords.lon
      });
    }
  }

  async presentBannerUploaderPopover() {
    const popover = await this.popoverCtrl.create({
      component: ImageUploaderPopoverComponent,
      componentProps: { type: 'banner', max: 5, size: { width: 3200, height: 2132 } },
      cssClass: 'imageUploaderPopover',
      backdropDismiss: false
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      this.tripModel.bannerImages = data.map(({ url }) => {
        return { id: null, url, title: null };
      });
    }
  }

  moveCenter(e) {
    this.coords.lat = e.lat;
    this.coords.lon = e.lng;
  }

  async presentEditPopover(e, index: number) {
    e.stopPropagation();

    const popover = await this.popoverCtrl.create({
      component: GalleryImgActionPopoverComponent,
      componentProps: { model: this.tripModel.bannerImages[index] },
      cssClass: 'galleryImgActionPopover'
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      if (data.action === 'delete') {
        this.alertService.confirm(
          'Delete Banner Image',
          'Are you sure you want to delete permanently delete this image?',
          { label: 'Delete', handler: () =>  {
            // if photo has already been saved to db
            if (this.tripModel.bannerImages[index].id) {
              this.tripModel.bannerImages = [...this.tripModel.bannerImages];
              this.deleteImageByIdGQL.mutate({
                id: this.tripModel.bannerImages[index].id
              }).subscribe(
                () => {
                  this.tripModel.bannerImages.splice(index, 1);
                  this.toastDelete('Banner image deleted');
                }
              );
            } else {
              this.tripModel.bannerImages.splice(index, 1);
              this.toastDelete('Banner image deleted');
            }
          }}
        );
      } else {
        // update photo
        const editedPhoto = {...this.tripModel.bannerImages[index]};
        editedPhoto.description = data.data.description;

        this.tripModel.photoHasChanged.push(editedPhoto);
      }
    }
  }

  deleteTrip() {
    this.alertService.confirm(
      'Delete Trip',
      `Are you sure you want to delete this trip? All the associated \
      information will be deleted and this action cannot be reversed`,
      { label: 'Delete Trip', handler: () =>  {
        this.deleteTripByIdGQL.mutate({
          tripId: this.params.data.tripId
        }).subscribe(
          () => {
            this.toastDelete('Trip deleted');
            this.modalCtrl.dismiss();
          }
        );
      }}
    );
  }

  async toastDelete(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
}

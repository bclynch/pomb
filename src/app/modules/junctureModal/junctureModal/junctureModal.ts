import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParams, PopoverController, ModalController, ToastController } from '@ionic/angular';
import { MapsAPILoader } from '@agm/core';
import * as moment from 'moment';
import {
  FullJunctureByIdGQL,
  TripsByUserIdGQL,
  DeleteImageByIdGQL,
  DeleteJunctureByIdGQL
} from '../../../generated/graphql';
import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { UtilService } from '../../../services/util.service';
import { AlertService } from '../../../services/alert.service';
import { GeoService } from '../../../services/geo.service';

import { JunctureSaveTypePopoverComponent } from '../../../components/junctureSaveType/junctureSaveTypePopover.component';
import { DatePickerModalComponent } from '../../datepickerModal/datepickerModal/datepickerModal';
import { ImageUploaderPopoverComponent } from '../../imageUploader/imageUploader/imageUploaderPopover.component';
import { GalleryImgActionPopoverComponent } from '../../galleryImgActionPopover/galleryImgAction/galleryImgActionPopover.component';

@Component({
  selector: 'JunctureModal',
  templateUrl: './junctureModal.html',
  styleUrls: ['./junctureModal.scss']
})
export class JunctureModalComponent {

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
      'indent',
      '|',
      'specialCharacters',
      'selectAll',
      'clearFormatting',
      'html',
      '|',
      'undo',
      'redo'
    ]
  };

  junctureModel = {
    name: 'Juncture ' + moment().format('l'),
    time: Date.now(),
    description: '',
    selectedTrip: null,
    photoHasChanged: [],
    type: 'HIKE'
  };
  inited = false;
  junctureSaveType = 'Publish';
  tripOptions = null;
  typeOptions = [
    { label: 'Hike', value: 'HIKE' },
    { label: 'Bike', value: 'BIKE' },
    { label: 'Run', value: 'RUN' },
    { label: 'Transportation', value: 'TRANSPORTATION' },
    { label: 'Flight', value: 'FLIGHT' },
  ];
  geoJsonObject: object = null;

  galleryPhotos = [];
  markerURL: string = null;
  startMarkerURL: string;

  coords = { lat: null, lon: null };
  mapStyle;
  zoomLevel = 12;
  dataLayerStyle;
  latlngBounds;
  gpxLoaded = false;
  gpxChanged = false;

  tabBtns = ['Upload GPX', 'Manual'];
  selectedIndex = 0;

  constructor(
    private userService: UserService,
    public params: NavParams,
    public settingsService: SettingsService,
    private mapsAPILoader: MapsAPILoader,
    private utilService: UtilService,
    private popoverCtrl: PopoverController,
    private alertService: AlertService,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public sanitizer: DomSanitizer,
    private geoService: GeoService,
    private fullJunctureByIdGQL: FullJunctureByIdGQL,
    private tripsByUserIdGQL: TripsByUserIdGQL,
    private deleteImageByIdGQL: DeleteImageByIdGQL,
    private deleteJunctureByIdGQL: DeleteJunctureByIdGQL,
  ) {

    this.dataLayerStyle = {
      clickable: false,
      strokeColor: this.settingsService.secondaryColor,
      strokeWeight: 3
    };

    // grab existing trip if it exists
    if (this.params.data.junctureId) {
      this.fullJunctureByIdGQL.fetch({
        id: this.params.data.junctureId,
        userId: this.userService.user.id
      }).subscribe(
        ({ data }) => {
          // console.log(result);
          const {
            name,
            description,
            tripByTripId,
            arrivalDate,
            type,
            lat,
            lon,
            markerImg,
            imagesByJunctureId,
            coordsByJunctureId
          } = data.junctureById;
          // populate model
          this.junctureModel.name = name;
          this.junctureModel.description = description;
          this.junctureModel.selectedTrip = tripByTripId.id;
          this.junctureModel.time = +arrivalDate;
          this.junctureModel.type = type;
          this.coords.lat = +lat;
          this.coords.lon = +lon;
          this.markerURL = markerImg;
          this.galleryPhotos = imagesByJunctureId.nodes;

          // check which type of juncture it is
          if (!coordsByJunctureId.nodes.length) {
            // if no coords put on manual tab
            this.selectedIndex = 1;
          } else {
            // if coords populate data
            // fitting the map to the data layer OR the marker
            this.geoJsonObject = this.geoService.generateGeoJSON([coordsByJunctureId.nodes]);
            this.mapsAPILoader.load().then(() => {
              this.latlngBounds = new window.google.maps.LatLngBounds();
              // take five coord pairs from the coords arr evenly spaced to hopefully encapsulate all the bounds
              const chosenCoords = [];
              const desiredNumberPairs = 5;
              for (
                let i = 0;
                i < coordsByJunctureId.nodes.length && chosenCoords.length < desiredNumberPairs;
                i += Math.ceil(coordsByJunctureId.nodes.length / desiredNumberPairs
              )) {
                chosenCoords.push(coordsByJunctureId.nodes[i]);
              }

              chosenCoords.forEach((pair) => {
                this.latlngBounds.extend(new window.google.maps.LatLng(pair.lat, pair.lon));
              });

              this.gpxLoaded = true;
            });
          }

          this.grabMapStyle();

          // populate trip select
          this.tripOptions = [{ id: tripByTripId.id, name: tripByTripId.name }];
        }
      );
    } else {
      this.markerURL = this.params.data.markerImg;

      // grab trips to populate select
      this.tripsByUserIdGQL.fetch({
        userId: this.userService.user.id
      }).subscribe(
        (data: any) => {
          this.tripOptions = data.data.allTrips.nodes;
          if (this.tripOptions[0]) {
            this.junctureModel.selectedTrip = this.tripOptions[0].id;
          }
        }
      );
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

  onCloseModal() {
    this.modalCtrl.dismiss();
  }

  onGPXProcessed(gpxData) {
    this.gpxLoaded = false;

    this.mapsAPILoader.load().then(() => {
      this.latlngBounds = new window.google.maps.LatLngBounds();
      // take five coord pairs from the coords arr evenly spaced to hopefully encapsulate all the bounds
      const chosenCoords = [];
      const desiredNumberPairs = 5;
      for (
        let i = 0;
        i < gpxData.geometry.coordinates.length && chosenCoords.length < desiredNumberPairs;
        i += Math.ceil(gpxData.geometry.coordinates.length / desiredNumberPairs
      )) {
        chosenCoords.push(gpxData.geometry.coordinates[i]);
      }

      chosenCoords.forEach((dataSet) => {
        this.latlngBounds.extend(new window.google.maps.LatLng(dataSet[1], dataSet[0]));
      });

      this.coords.lat = gpxData.geometry.coordinates.slice(-1)[0][1];
      this.coords.lon = gpxData.geometry.coordinates.slice(-1)[0][0];
      this.geoJsonObject = gpxData;
      this.gpxLoaded = true;
      this.gpxChanged = true;
    });
  }

  async presentPopover(event) {
    const popover = await this.popoverCtrl.create({
      component: JunctureSaveTypePopoverComponent,
      componentProps: { options: ['Draft', 'Publish'] },
      cssClass: 'junctureSaveTypePopover',
      event
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      this.junctureSaveType = data;
    }
  }

  async presentDatepickerModal(e: Event) {
    e.stopPropagation();

    const modal = await this.modalCtrl.create({
      component: DatePickerModalComponent,
      componentProps: { date: this.junctureModel.time },
      cssClass: 'datepickerModal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.junctureModel.time = Date.parse(data);
    }
  }

  async presentGalleryUploaderPopover() {
    if (this.galleryPhotos.length === 6) {
      this.alertService.alert(
        'Gallery Full',
        'Only 6 images per juncture gallery maximum. Please delete a few to add more.'
      );
    } else {
      // type is gallery as of original
      const popover = await this.popoverCtrl.create({
        component: ImageUploaderPopoverComponent,
        componentProps: { type: 'juncture', existingPhotos: this.galleryPhotos.length, max: 6 },
        cssClass: 'imageUploaderPopover',
        backdropDismiss: false
      });
      await popover.present();

      const { data } = await popover.onWillDismiss();
      if (data) {
        if (data === 'maxErr') {
          this.alertService.alert(
            'Gallery Max Exceeded',
            'Please reduce the number of images in the gallery to 6 or less'
          );
        } else {
          data.forEach(({ size, url }) => {
            if (size === 'marker') {
              this.markerURL = url;
            } else {
              this.galleryPhotos = [...this.galleryPhotos];
              this.galleryPhotos.push({
                id: null,
                url,
                description: ''
              });
            }
          });
        }
      }
    }
  }

  async presentGalleryPopover(e, index: number) {
    const popover = await this.popoverCtrl.create({
      component: GalleryImgActionPopoverComponent,
      componentProps: { model: this.galleryPhotos[index] },
      cssClass: 'galleryImgActionPopover'
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      if (data.action === 'delete') {
        this.alertService.confirm(
          'Delete Gallery Image',
          'Are you sure you want to delete permanently delete this image? This action cannot be reversed',
          { label: 'Delete', handler: () =>  {
            // if photo has already been saved to db
            if (this.galleryPhotos[index].id) {
              this.galleryPhotos = [...this.galleryPhotos];
              this.deleteImageByIdGQL.mutate({
                id: this.galleryPhotos[index].id
              }).subscribe(
                result => {
                  this.galleryPhotos.splice(index, 1);
                  this.toastDelete('Gallery image deleted');
                }
              );
            } else {
              this.galleryPhotos.splice(index, 1);
              this.toastDelete('Gallery image deleted');
            }
          }}
        );
      } else {
        // update photo
        const editedPhoto = {...this.galleryPhotos[index]};
        editedPhoto.description = data.data.description;

        this.junctureModel.photoHasChanged.push(editedPhoto);
      }
    }
  }

  saveJuncture() {
    if (!this.junctureModel.name) {
      this.alertService.alert('Missing Information', 'Please enter a name for your juncture and try to save again.');
    } else if (this.selectedIndex === 0 && !this.geoJsonObject) {
      this.alertService.alert('Notification', 'Upload gpx data or try a manual location for your juncture.');
    } else {
      this.modalCtrl.dismiss({
        isExisting: this.params.data.junctureId ? true : false,
        saveType: this.junctureSaveType,
        name: this.junctureModel.name,
        description: this.junctureModel.description,
        type: this.junctureModel.type,
        photos: this.galleryPhotos,
        time: this.junctureModel.time,
        location: this.coords,
        selectedTrip: this.junctureModel.selectedTrip,
        markerImg: this.markerURL,
        geoJSON: this.geoJsonObject,
        gpxChanged: this.gpxChanged,
        changedPhotos: this.junctureModel.photoHasChanged
      });
    }
  }

  moveCenter({ lat, lng }) {
    this.coords.lat = lat;
    this.coords.lon = lng;
  }

  deleteJuncture() {
    this.alertService.confirm(
      'Delete Juncture',
      `Are you sure you want to delete this juncture? All the associated information will be deleted and \
      this action cannot be reversed`,
      { label: 'Delete Juncture', handler: () =>  {
        this.deleteJunctureByIdGQL.mutate({
          junctureId: this.params.data.junctureId
        }).subscribe(
          () => {
            this.toastDelete('Juncture deleted');
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

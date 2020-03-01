import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

import { TripModal } from '../shared/tripModal/tripModal';
import { APIService } from './api.service';
import { UserService } from './user.service';
import { UpdateTripByIdGQL, CreateTripGQL } from '../generated/graphql';
import { ImageType } from '../models/Image.model';
import { Trip } from '../models/Trip.model';

@Injectable()
export class TripService {

  displayTripNav: boolean;

  constructor(
    private modalCtrl: ModalController,
    private apiService: APIService,
    private toastCtrl: ToastController,
    private userService: UserService,
    private updateTripByIdGQL: UpdateTripByIdGQL,
    private createTripGQL: CreateTripGQL
  ) { }

  openTripModal(tripId): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const modal = await this.modalCtrl.create({
        component: TripModal, 
        componentProps: { tripId }, 
        cssClass: 'tripModal',
        backdropDismiss: false
      });

      await modal.present();

      const { data } = await modal.onWillDismiss();
      if (data) {
        const { isExisting, name, description, timeStart, timeEnd, startLat, startLon, bannerImages, photoHasChanged } = data;
        if (isExisting) {
          this.updateTripByIdGQL.mutate({
            tripId,
            name,
            description,
            startDate: +timeStart, 
            endDate: +timeEnd,
            startLat, 
            startLon
          }).subscribe(
            result => {
              // update banner images as required
              this.comparePhotos(bannerImages, photoHasChanged, tripId).then(
                result => resolve()
              );
            },
            err => {
              console.log(err);
              reject();
            }
          );
        } else {
          // create trip
          this.createTripGQL.mutate({
            userId: this.userService.user.id,
            name,
            description,
            startDate: timeStart,
            endDate: timeEnd,
            startLat,
            startLon
          }).subscribe(
            (result: any) => {
              // save banner photos
              this.saveBannerPhotos(bannerImages, result.data.createTrip.trip.id).then(
                () => {
                  this.toast(`New trip '${name}' successfully created`);
                  resolve();
                },
                err => reject()
              );
            }
          );
        }
      }
    });
  }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  saveBannerPhotos(bannerPhotos: { url: string; title: string; }[], tripId: number) {
    return new Promise((resolve, reject) => {
      if (!bannerPhotos.length) resolve();

      // then bulk add links to post
      let query = `mutation {`;
      bannerPhotos.forEach((photo, i) => {
        query += `a${i}: createImage(
          input: {
            image: {
              tripId: ${tripId},
              userId: ${this.userService.user.id},
              type: ${ImageType['BANNER']},
              url: "${photo.url}",
              ${photo.title ? 'title: "' + photo.title + '"' : ''}
            }
          }) {
            clientMutationId
          }`;
      });
      query += `}`;

      this.apiService.genericCall(query).subscribe(
        result => resolve(result),
        err => console.log(err)
      );
    });
  }

  // function returns what the nature of the trip is currently
  tripStatus(startDate: number, endDate: number): 'complete' | 'active' | 'upcoming' {
    // to be upcoming it must have a start date beyond current
    if (startDate > Date.now()) return 'upcoming';

    // to be complete it must have an end date and be in the past
    if (endDate && endDate < Date.now()) return 'complete';

    // otherwise it's active
    return 'active';
  }

  comparePhotos(photos, changedPhotos, tripId) {
    return new Promise((resolve, reject) => {
      const promiseArr = [];

      // next check out if gallery photos are different
      // create arr of new photos (we can tell because they don't have an id yet)
      const newPhotoArr = photos.filter((img) => !img.id );
      this.saveBannerPhotos(newPhotoArr, tripId).then(
        result => {
          // update edited gallery photos
          // make sure 'new' photos not on 'edited' arr
          const filteredEditedArr = changedPhotos.filter((img => newPhotoArr.indexOf(img) === -1));
          // then bulk update imgs
          if (filteredEditedArr.length) {
            let query = `mutation {`;
            filteredEditedArr.forEach((img, i) => {
              query += `a${i}: updateImageById(
                input: {
                  id: ${img.id},
                  imagePatch:{
                    url: "${img.url}",
                    description: "${img.description}"
                  }
                }
              ) {
                clientMutationId
              }
            `;
            });
            query += `}`;

            this.apiService.genericCall(query).subscribe(
              result => resolve(result),
              err => console.log(err)
            );
          } else {
            resolve();
          }
        }
      );
    });
  }
}

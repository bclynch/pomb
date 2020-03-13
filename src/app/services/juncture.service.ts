import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { JunctureModalComponent } from '../shared/junctureModal/junctureModal';
import { APIService } from './api.service';
import { UserService } from './user.service';
import { UtilService } from './util.service';
import { GalleryPhoto } from '../models/GalleryPhoto.model';
import { ImageType } from '../models/Image.model';
import {
  UpdateJunctureGQL,
  CreateJunctureGQL,
  UpdateAccountByIdGQL,
  CreateUserToCountryGQL
} from '../generated/graphql';

@Injectable()
export class JunctureService {

  displayTripNav: boolean;
  defaultMarkerImg = 'https://www.imojado.org/wp-content/uploads/2016/08/1470289254_skylab-studio.png';
  defaultStartImg = '../assets/images/logo/logo96.png';

  constructor(
    private modalCtrl: ModalController,
    private apiService: APIService,
    private toastCtrl: ToastController,
    private userService: UserService,
    private utilService: UtilService,
    private updateJunctureGQL: UpdateJunctureGQL,
    private createJunctureGQL: CreateJunctureGQL,
    private updateAccountByIdGQL: UpdateAccountByIdGQL,
    private createUserToCountryGQL: CreateUserToCountryGQL
  ) { }

  openJunctureModal(junctureId): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let country = null;
      const modal = await this.modalCtrl.create({
        component: JunctureModalComponent,
        componentProps: { markerImg: this.defaultMarkerImg, junctureId },
        cssClass: 'junctureModal',
        backdropDismiss: false
      });

      await modal.present();

      const { data } = await modal.onWillDismiss();
      if (data) {
        const {
          location,
          isExisting,
          selectedTrip,
          geoJSON,
          gpxChanged,
          type,
          name,
          time,
          description,
          saveType,
          markerImg,
          photos,
          changedPhotos
        } = data;
        const { lat, lon } = location;
        this.apiService.reverseGeocodeCoords(lat, lon).subscribe(
          result => {
            console.log(result);
            const city = this.utilService.extractCity(result.formattedAddress.address_components);
            for (let i = 0; i < result.country.address_components.length; i++) {
              if (result.country.address_components[i].types.indexOf('country') !== -1) {
                country = result.country.address_components[i].short_name;
                break;
              }
            }

            // check if country exists in user list. If not then add
            this.checkCountry(country);

            if (isExisting) {
              this.updateJunctureGQL.mutate({
                junctureId,
                userId: this.userService.user.id,
                tripId: selectedTrip,
                type,
                name,
                arrivalDate: +time,
                description,
                lat, 
                lon,
                city,
                country,
                isDraft: saveType === 'Draft',
                markerImg
              }).subscribe(
                () => {
                  // upload new gpx if requred
                  if (gpxChanged) {
                    this.apiService.uploadGPX(geoJSON, junctureId).subscribe(
                      jsonData => {
                        // update gallery images as required
                        this.comparePhotos(photos, changedPhotos, junctureId, selectedTrip).then(
                          () => resolve()
                        );
                      },
                      err => {
                        console.log(err);
                        reject();
                      }
                    );
                  } else {
                    // update banner images as required
                    this.comparePhotos(photos, changedPhotos, junctureId, selectedTrip).then(
                      () => resolve()
                    );
                    resolve();
                  }
                },
                err => {
                  console.log(err);
                  reject();
                }
              );
            } else {
              this.createJunctureGQL.mutate({
                userId: this.userService.user.id,
                tripId: selectedTrip,
                type,
                name,
                arrivalDate: time,
                description,
                lat,
                lon,
                city,
                country,
                isDraft: saveType === 'Draft',
                markerImg
              }).subscribe(
                ({ data }: any) => {
                  console.log(data);

                  // check setting to update user location -- if so update
                  if (this.userService.user.autoUpdateLocation) {
                    const {
                      id,
                      firstName,
                      lastName,
                      userStatus,
                      heroPhoto,
                      profilePhoto,
                      autoUpdateLocation
                    } = this.userService.user;
                    this.updateAccountByIdGQL.mutate({
                      id,
                      firstName,
                      lastName,
                      userStatus,
                      heroPhoto,
                      profilePhoto,
                      city,
                      country,
                      autoUpdate: autoUpdateLocation
                    }).subscribe(
                      ({ data }: any) => {
                        // set user service to new returned user
                        this.userService.user = data.updateAccountById.account;
                      }
                    );
                  }

                  // upload gpx data
                  if (geoJSON) {
                    this.apiService.uploadGPX(geoJSON, data.createJuncture.juncture.id).subscribe(
                      jsonData => {
                        this.saveGalleryPhotos(
                          data.createJuncture.juncture.id,
                          photos,
                          selectedTrip
                        ).then(() => {
                          this.toast(
                            saveType === 'Draft'
                              ? 'Juncture draft successfully saved'
                              : 'Juncture successfully published'
                          );
                          resolve();
                        });
                      },
                      err => {
                        console.log(err);
                        reject();
                      }
                    );
                  } else {
                    this.saveGalleryPhotos(data.createJuncture.juncture.id, photos, selectedTrip).then(() => {
                      this.toast(
                        saveType === 'Draft'
                          ? 'Juncture draft successfully saved'
                          : 'Juncture successfully published'
                      );
                      resolve();
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  }

  saveGalleryPhotos(junctureId: number, photoArr, tripId: number) {
    return new Promise((resolve, reject) => {
      if (!photoArr.length) {
        resolve();
      }

      // then bulk add links to post
      let query = `mutation {`;
      photoArr.forEach((photo, i) => {
        query += `a${i}: createImage(
          input: {
            image: {
              tripId: ${tripId},
              junctureId: ${junctureId}
              userId: ${this.userService.user.id},
              type: ${ImageType.GALLERY},
              url: "${photo.url}",
              ${photo.description ? 'description: "' + photo.description + '"' : ''}
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

  comparePhotos(photos, changedPhotos, junctureId: number, tripId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const promiseArr = [];

      // next check out if gallery photos are different
      // create arr of new photos (we can tell because they don't have an id yet)
      const newPhotoArr = photos.filter((img) => !img.id );
      this.saveGalleryPhotos(junctureId, newPhotoArr, tripId).then(
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
              (result: any) => resolve(result),
              err => console.log(err)
            );
          } else {
            resolve();
          }
        }
      );
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

  checkCountry(country: string) {
    // if option is toggled on
    if (this.userService.user.autoUpdateVisited) {
      // create nicer arr to work with
      const countriesVisited = this.userService.user.userToCountriesByUserId.nodes.map(({ countryByCountry }) => countryByCountry.code);
      console.log(country);
      // if country code doesn't exist then add it
      if (countriesVisited.indexOf(country) === -1) {
        this.createUserToCountryGQL.mutate({
          code: country,
          userId: this.userService.user.id
        }).subscribe(
          result => {},
          err => console.log(err)
        );
      }
    }
  }
}

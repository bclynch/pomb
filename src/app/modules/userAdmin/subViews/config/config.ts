import { Component, OnDestroy } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';

import { AppService } from '../../../../services/app.service';
import { APIService } from '../../../../services/api.service';
import { UserService } from '../../../../services/user.service';

import { GradientPopoverComponent } from '../../../../shared/gradientPopover/gradientPopover.component';
import { ImageUploaderPopoverComponent } from '../../../imageUploader/imageUploader/imageUploaderPopover.component';
import { SubscriptionLike } from 'rxjs';
import { UpdateAccountByIdGQL } from 'src/app/generated/graphql';

@Component({
  selector: 'page-useradmin-config',
  templateUrl: 'config.html',
  styleUrls: ['./config.scss']
})
export class UserAdminConfigPage implements OnDestroy {

  profileModel = { firstName: null, lastName: null, userStatus: null, heroBanner: null, userPhoto: null };
  locationModel = { city: null, country: null, autoUpdate: null };

  defaultBannerImg = 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-bridalveil-winter-1200x800.jpg';

  autoUpdateVisited;
  visitedCountries: { code: string; name: string; }[] = [];

  initSubscription: SubscriptionLike;

  constructor(
    private appService: AppService,
    private popoverCtrl: PopoverController,
    private apiService: APIService,
    private toastCtrl: ToastController,
    private userService: UserService,
    private updateAccountByIdGQL: UpdateAccountByIdGQL
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
    // populate inputs
    this.profileModel.firstName = this.userService.user.firstName;
    this.profileModel.lastName = this.userService.user.lastName;
    this.profileModel.userStatus = this.userService.user.userStatus;
    this.profileModel.userPhoto = this.userService.user.profilePhoto;
    this.profileModel.heroBanner = this.userService.user.heroPhoto;

    this.locationModel.city = this.userService.user.city;
    this.locationModel.country = this.userService.user.country;
    this.locationModel.autoUpdate = this.userService.user.autoUpdateLocation;

    this.visitedCountries = this.userService.user.userToCountriesByUserId.nodes.map((country) => (
      { code: country.countryByCountry.code.toLowerCase(), name: country.countryByCountry.name }
    ));
    this.autoUpdateVisited = this.userService.user.autoUpdateVisited;
  }

  async presentImageUploaderPopover(type: string) {
    const size = type === 'banner' ? { width: 1200, height: 300 } : null;

    const popover = await this.popoverCtrl.create({
      component: ImageUploaderPopoverComponent,
      componentProps: { type, size },
      cssClass: 'imageUploaderPopover',
      backdropDismiss: false
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      type === 'banner'
        ? this.profileModel.heroBanner = data[0].url
        : this.profileModel.userPhoto = data[0].url;
    }
  }

  async updateProfile() {
    const {
      id,
      city,
      country,
      autoUpdateLocation: autoUpdate
    } = this.userService.user;
    const {
      firstName,
      lastName,
      userStatus,
      heroBanner: heroPhoto,
      userPhoto: profilePhoto
    } = this.profileModel;
    this.updateAccountByIdGQL.mutate({
      id,
      firstName,
      lastName,
      userStatus,
      heroPhoto,
      profilePhoto,
      city,
      country,
      autoUpdate
    }).subscribe(
      ({ data }: any) => {
        // set user service to new returned user
        this.userService.user = data.updateAccountById.account;
        this.toast('Profile updated');
      }
    );
  }

  updateLocation() {
    const {
      id,
      firstName,
      lastName,
      userStatus,
      heroPhoto,
      profilePhoto
    } = this.userService.user;
    const {
      city,
      country,
      autoUpdate
    } = this.locationModel;
    this.updateAccountByIdGQL.mutate({
      id,
      firstName,
      lastName,
      userStatus,
      heroPhoto,
      profilePhoto,
      city,
      country,
      autoUpdate
    }).subscribe(
      ({ data }: any) => {
        // set user service to new returned user
        this.userService.user = data.updateAccountById.account;
        this.toast('Location updated');
      }
    );
  }

  addCountry(country) {
    console.log(country);
    const selectedCountry = { code: country.code.toLowerCase(), name: country.name };
    if (this.visitedCountries.map(({ code }) => code).indexOf(selectedCountry.code) === -1) {
      this.visitedCountries.push(selectedCountry);
    }
  }

  removeCountry(index: number) {
    this.visitedCountries.splice(index, 1);
  }

  updateCountries() {
    // checking for dif between arrays
    const diffExisting = this.userService.user.userToCountriesByUserId.nodes.filter((x) => (
      this.visitedCountries.map((countryToSave) => countryToSave.name).indexOf(x.countryByCountry.name) < 0)
    );
    console.log(diffExisting); // remove country
    const moddedExisting = this.userService.user.userToCountriesByUserId.nodes
      .map(({ countryByCountry: { name } }) => name);
    const diffNew = this.visitedCountries.filter(x => moddedExisting.indexOf(x.name) < 0);
    console.log(diffNew); // add country

    // if no changes resolve
    if (!diffExisting.length && !diffNew.length) {
      return;
    }

    const promiseArr = [];

    // if diff new need to add
    if (diffNew.length) {
      const promise = new Promise((resolve, reject) => {
        // then bulk add tag to post
        let query = `mutation {`;
        diffNew.forEach((country, i) => {
          query += `a${i}: createUserToCountry(
            input: {
              userToCountry: {
                country: "${country.code.toUpperCase()}",
                userId: ${this.userService.user.id}
              }
            }) {
              clientMutationId
            }
        `;
        });
        query += `}`;

        this.apiService.genericCall(query).subscribe(
          result => resolve(result),
          err => reject(err)
        );
      });
      promiseArr.push(promise);
    }

    // // Has diff existing so run a for each and delete
    if (diffExisting.length) {
      const promise = new Promise((resolve, reject) => {
        let query = `mutation {`;
        diffExisting.forEach((country, i) => {
          query += `a${i}: deleteUserToCountryById(
            input: {
              id: ${country.id}
            }) {
              clientMutationId
            }
        `;
        });
        query += `}`;

        this.apiService.genericCall(query).subscribe(
          result => resolve(),
          err => reject(err)
        );
      });
      promiseArr.push(promise);
    }

    Promise.all(promiseArr).then(
      () => this.toast('Visited Countries updated')
    );
  }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
}

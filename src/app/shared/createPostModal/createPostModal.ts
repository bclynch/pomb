import { Component, NgZone } from '@angular/core';
import {
  NavParams,
  AlertController,
  PopoverController,
  ModalController,
  ToastController
} from '@ionic/angular';
import * as moment from 'moment';
import { MapsAPILoader } from '@agm/core'; // using to spin up google ready for geocoding with current location
import FroalaEditor from 'froala-editor';

import { APIService } from '../../services/api.service';
import { SettingsService } from '../../services/settings.service';
import { AlertService } from '../../services/alert.service';
import { UserService } from '../../services/user.service';
import { UtilService } from '../../services/util.service';

import { Post } from '../../models/Post.model';
import { ImageType } from '../../models/Image.model';
import { GalleryPhoto } from '../../models/GalleryPhoto.model';

import { PostTypePopoverComponent } from '../postType/postTypePopover.component';
import { ImageUploaderPopoverComponent } from '../imageUploader/imageUploaderPopover.component';
import { GalleryImgActionPopoverComponent } from '../galleryImgAction/galleryImgActionPopover.component';
import { DatePickerModalComponent } from '../datepickerModal/datepickerModal';
import {
  TripsByUserGQL,
  GetAllCountriesGQL,
  UpdatePostByIdGQL,
  CreatePostGQL,
  CreatePostTagGQL,
  DeletePostToTagByIdGQL,
  DeleteImageByIdGQL
} from '../../generated/graphql';

interface PostOption {
  name: string;
  description: string;
  secondaryDescription: string;
}

interface RelativeTime {
  label: string;
  value: number;
}

interface Tag {
  name: string;
  exists: boolean;
  postToTagId?: number;
}

interface PostModel {
  postTitle: string;
  postSubtitle: string;
  content: string;
  leadPhotoTitle: string;
  tripId: any;
  junctureId: number;
  city: string;
  country: string;
}

interface LeadPhoto {
  size: any;
  url: string;
}

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './createPostModal.html',
  styleUrls: ['./createPostModal.scss']
})
export class CreatePostModalComponent {

  containerOptions: string[] = ['Content', 'Options', 'Gallery'];
  activeContainerOption = 0;
  btnOptions: string[] = ['Cancel', 'Delete', 'Save'];
  postModel: PostModel = {
    postTitle: '',
    postSubtitle: '',
    content: '',
    leadPhotoTitle: '',
    tripId: null,
    junctureId: null,
    city: null,
    country: null
  };
  data: Post;

  // https://www.froala.com/wysiwyg-editor/docs/options#toolbarButtons
  editorOptions: object;

  activePostOption = 1; // 2 when scheduled exists
  postOptions: PostOption[] = [
    {
      name: 'Published',
      description: 'Publish this post now',
      secondaryDescription: 'Publish '
    },
    // { name: 'Scheduled', description: 'Publish this post in the future', secondaryDescription: 'Schedule for ' },
    {
      name: 'Draft',
      description: 'Save this post for later editing',
      secondaryDescription: 'This post will not be visible'
    }
  ];

  scheduledModel: RelativeTime = { label: 'now', value: Date.now() };
  publishModel: RelativeTime = { label: 'now', value: Date.now() };

  tagOptions: Tag[] = [];

  galleryPhotos: GalleryPhoto[] = [];
  galleryItemHasChanged: GalleryPhoto[] = [];
  leadPhotoLinks: LeadPhoto[] = [];
  displayedLeadPhoto: LeadPhoto;

  tripOptions;
  countries;
  junctureOptions = [];

  constructor(
    private apiService: APIService,
    private alertCtrl: AlertController,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private settingsService: SettingsService,
    private modalController: ModalController,
    private alertService: AlertService,
    private toastCtrl: ToastController,
    private userService: UserService,
    private utilService: UtilService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private tripsByUserGQL: TripsByUserGQL,
    private getAllCountriesGQL: GetAllCountriesGQL,
    private updatePostByIdGQL: UpdatePostByIdGQL,
    private createPostGQL: CreatePostGQL,
    private createPostTagGQL: CreatePostTagGQL,
    private deletePostToTagByIdGQL: DeletePostToTagByIdGQL,
    private deleteImageByIdGQL: DeleteImageByIdGQL
  ) {
    this.data = params.get('post');
    // console.log(this.data);
    // get options to populate trip + juncture selects
    this.tripsByUserGQL.fetch({
      id: this.userService.user.id
    }).subscribe(
      ({ data }) => {
        this.tripOptions = data.allTrips.nodes;

        // populate country options
        this.getAllCountriesGQL.fetch().subscribe(
          ({ data: { allCountries } }) => {
            this.countries = allCountries.nodes;
          }
        );

        if (this.data) {
          this.postModel.postTitle = this.data.title;
          this.postModel.postSubtitle = this.data.subtitle;
          this.postModel.content = this.data.content;
          this.postModel.tripId = this.data.tripId;
          if (this.postModel.tripId) {
            this.populateJunctures();
          }
          this.postModel.junctureId = this.data.junctureId;
          if (this.postModel.junctureId) {
            this.populateLocation();
          }
          this.data.postToTagsByPostId.nodes.forEach((tag) => {
            this.tagOptions.push({ name: tag.postTagByPostTagId.name, exists: true, postToTagId: tag.id });
          });
          this.leadPhotoLinks = [];
          this.galleryPhotos = [];
          this.data.imagesByPostId.nodes.forEach(({ type, id, url, description, title }) => {
            if (type === ImageType.GALLERY) {
              this.galleryPhotos.push({ id, photoUrl: url, description });
            } else {
              this.leadPhotoLinks.push({ url, size: null });
              this.postModel.leadPhotoTitle = title;
            }
          });
          this.displayedLeadPhoto = this.leadPhotoLinks[0];
          if (this.data.scheduledDate) {
            this.scheduledModel.value = +this.data.scheduledDate;
            this.scheduledModel.label = moment(+this.data.scheduledDate).fromNow();
          }
          if (this.data.publishedDate) {
            this.publishModel.value = +this.data.publishedDate;
            this.publishModel.label = moment(+this.data.publishedDate).fromNow();
          }

          // change back when scheduled is here
          this.activePostOption = this.data.isDraft ? 1 : this.data.isScheduled ? 123 : 0;
        }

        this.mapsAPILoader.load().then(() => {
          // geocoding ready
        });
      }
    );

    // creating custom image uploader
    FroalaEditor.DefineIcon('myImageUploader', { NAME: 'image' });
    const self = this;
    FroalaEditor.RegisterCommand('myImageUploader', {
      title: 'Upload Image',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: () => {
        self.presentImageUploaderPopover('post').then((data) => {
          if (data) {
            // this.html.insert(`<img src="${data[0].url}" width="${data[0].size === 800 ? '100%' : '50%'}" />`);
          }
        });
      }
    });

    this.editorOptions = {
      placeholderText: 'Write something insightful...*',
      heightMin: '350px',
      heightMax: '525px',
      toolbarButtons: [
        'fullscreen',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        '|',
        'fontFamily',
        'fontSize',
        'color',
        'paragraphStyle',
        '|',
        'paragraphFormat',
        'align',
        'formatOL',
        'formatUL',
        'outdent',
        'indent',
        '-',
        'insertLink',
        'myImageUploader',
        'insertVideo',
        '|',
        'emoticons',
        'specialCharacters',
        'insertHR',
        'selectAll',
        'clearFormatting',
        '|',
        'print',
        'spellChecker',
        'help',
        'html',
        '|',
        'undo',
        'redo'
      ]
    };
  }

  selectSmallLeadPhoto(arr: LeadPhoto[]): LeadPhoto {
    let smallPhoto: LeadPhoto;
    arr.forEach((photo) => {
      if (photo.size === 320) {
        smallPhoto = photo;
      }
    });
    return smallPhoto;
  }

  clickBtn(index) {
    switch (index) {
      case 0:
        this.cancelConfirm();
        break;
      case 1:
        this.deleteConfirm();
        break;
      case 2:
        this.savePost();
        break;
    }
  }

  async cancelConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Review Changes',
      message: 'You have unsaved work, do you want to save or discard it?',
      cssClass: 'confirmAlert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Discard',
          handler: () => {
            this.modalController.dismiss();
          }
        },
        {
          text: 'Save',
          handler: () => {
            this.savePost();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Discard Post',
      message: 'Are you sure you want to discard this post?',
      cssClass: 'confirmAlert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.modalController.dismiss({ type: 'deleted', title: this.postModel.postTitle });
          }
        }
      ]
    });

    await alert.present();
  }

  savePost() {
    // validate required fields filled out if post status is scheduled or publish
    if (this.activePostOption !== 1) { // is 2 when scheduled exists
      const requiredFields: { field: any, label: string }[] = [
        { field: this.postModel.postTitle, label: 'post title' },
        { field: this.postModel.postSubtitle, label: 'post subtitle' },
        { field: this.postModel.content, label: 'post content' },
        { field: this.postModel.leadPhotoTitle, label: 'primary image title' },
        { field: this.displayedLeadPhoto, label: 'primary image' }
      ];
      for (let i = 0; i < requiredFields.length; i++) {
        if (!requiredFields[i].field) {
          this.alertService.alert(
            'Error',
            `In order to publish or schedule a post all required fields must be filled out.
              Please check the ${requiredFields[i].label} field and try again.`
          );
          return;
        }
      }
    }

    // if has a post we know its a put otherwise a post
    this.data ? this.updatePost() : this.createPost();
  }

  updatePost() {
    // this.data is the original data passed in and shouldn't be mutated
    // We can use this as a ref to know if we need to pass in new edits/changes
    this.updatePostByIdGQL.mutate({
      postId: this.data.id,
      title: this.postModel.postTitle,
      subtitle: this.postModel.postSubtitle,
      content: this.postModel.content,
      tripId: this.postModel.tripId,
      junctureId: this.postModel.junctureId,
      city: this.postModel.city,
      country: this.postModel.country,
      isDraft: this.activePostOption === 1,
      isScheduled: this.activePostOption === 123,
      isPublished: this.activePostOption === 0,
      scheduledDate: this.activePostOption === 123 ? this.scheduledModel.value : null,
      publishedDate: this.activePostOption === 0 ? this.publishModel.value : null
    })
      .subscribe(
        () => {
          const updatePromises = [];

          // check if photos on the post have changed
          updatePromises.push(this.comparePhotos());

          // check if tags have changed. If so update post tags and or post to tags as required
          updatePromises.push(this.compareTags());

          // when all the above have resolved dismiss the modal
          Promise.all(updatePromises).then(() => {
            this.modalController.dismiss({ type: 'updated', title: this.postModel.postTitle });
          });
        }
      );
  }

  createPost() {
    const self = this;
    // Add most of the model to our post table
    this.createPostGQL.mutate({
      author: this.userService.user.id,
      title: this.postModel.postTitle,
      subtitle: this.postModel.postSubtitle,
      content: this.postModel.content,
      isDraft: this.activePostOption === 1,
      isScheduled: this.activePostOption === 123,
      isPublished: this.activePostOption === 0,
      tripId: this.postModel.tripId,
      junctureId: this.postModel.junctureId,
      city: this.postModel.city,
      country: this.postModel.country,
      scheduledDate: this.activePostOption === 123 ? this.scheduledModel.value : null,
      publishedDate: this.activePostOption === 0 ? this.publishModel.value : null
    })
      .subscribe(
        result => {
          const createPostData = result as any;

          // Create lead photo
          this.createLeadPhotos(createPostData.data.createPost.post.id, this.postModel.leadPhotoTitle).then(
            () => {
              // create gallery photo links
              this.createGalleryPhotoLinks(createPostData.data.createPost.post.id, this.galleryPhotos).then(
                () => {

                  // create tags + save as required
                  this.createTagsMutation(createPostData.data.createPost.post.id, this.tagOptions).then(
                    () => this.modalController.dismiss({ type: 'created', title: this.postModel.postTitle }),
                    err => createPostErrorHandler(err)
                  );
                }, err => createPostErrorHandler(err)
              );
            }
          );
        }
      );

    function createPostErrorHandler(err: Error) {
      console.log(err);
      alert('something is fucked');
      self.modalController.dismiss();
    }
  }

  createLeadPhotos(postId: number, title: string) {
    return new Promise((resolve, reject) => {
      // then bulk add links to post
      if (this.leadPhotoLinks.length) {
        let query = `mutation {`;
        this.leadPhotoLinks.forEach((photo, i) => {
          query += `
            a${i}: createImage(
              input: {
                image: {
                  ${this.postModel.tripId ? 'tripId: ' + this.postModel.tripId : ''},
                  ${this.postModel.junctureId ? 'junctureId: ' + this.postModel.junctureId : ''},
                  postId: ${postId},
                  userId: ${this.userService.user.id},
                  type: ${i === 0 ? ImageType.LEAD_SMALL : ImageType.LEAD_LARGE},
                  url: "${this.leadPhotoLinks[i].url}",
                  title: "${title}"
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
    });
  }

  createGalleryPhotoLinks(postId: number, photoArr: GalleryPhoto[]) {
    return new Promise((resolve, reject) => {
      if (!photoArr.length) {
        resolve();
      }

      // bulk add links to post
      let query = `mutation {`;
      photoArr.forEach((photo, i) => {
        query += `a${i}: createImage(
          input: {
            image:{
              ${this.postModel.tripId ? 'tripId: ' + this.postModel.tripId : ''},
              ${this.postModel.junctureId ? 'junctureId: ' + this.postModel.junctureId : ''},
              postId: ${postId},
              userId: ${this.userService.user.id},
              type: ${ImageType.GALLERY},
              url: "${photo.photoUrl}",
              description: "${photo.description}"
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

  createTagsMutation(postId: number, tagsArr: Tag[]) {
    return new Promise((resolve) => {
      const finalTags: Tag[] = [];
      // first need to create any totally new tags and add to db
      const promiseArr = [];
      if (tagsArr.length) {
        tagsArr.forEach((tag, i) => {
          if (!tag.exists) {
            const promise = new Promise((resolve) => {
              this.createPostTagGQL.mutate({
                name: tag.name,
                tagDescription: null
              }).subscribe(
                data => {
                  const tagData = data as any;
                  finalTags.push({
                    name: tagData.data.createPostTag.postTag.name,
                    exists: true
                  });
                  resolve();
                }
              );
            });
            promiseArr.push(promise);
          } else {
            finalTags.push(tag);
          }
        });

        Promise.all(promiseArr).then(() => {
          console.log('promise all complete');

          if (finalTags.length) {
            // then bulk add tag to post
            let query = `mutation {`;
            finalTags.forEach((tag, i) => {
              query += `a${i}: createPostToTag(
                input: {
                  postToTag:{
                    postId: ${postId},
                    postTagId: "${tag.name}"
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
        });
      } else {
        resolve();
      }
    });
  }

  compareTags(): Promise<{}> {
    return new Promise((resolve) => {
      const promiseArr = [];
      // checking for dif between arrays
      const diffExisting = this.data.postToTagsByPostId.nodes
        .filter(x => this.tagOptions
        .map((optionToSave) => optionToSave.name)
        .indexOf(x.postTagByPostTagId.name) < 0);
      // console.log(diffExisting); // remove post to tag
      const moddedExisting = this.data.postToTagsByPostId.nodes.map((value) => value.postTagByPostTagId.name );
      const diffNew = this.tagOptions.filter(x => moddedExisting.indexOf(x.name) < 0);
      // console.log(diffNew); // create tag + post to tag

      // if no changes resolve
      if (!diffExisting.length && !diffNew.length) {
        resolve();
      }

      // If no diff existing
      // send these off to create tags mutation
      const promise1 = new Promise((resolve) => {
        if (!diffExisting.length) {
          this.createTagsMutation(this.data.id, diffNew).then(
            result => resolve()
          );
        } else {
          resolve();
        }
      });
      promiseArr.push(promise1);

      // Has diff existing so run a for each and delete
      if (diffExisting.length) {
        const promise2 = new Promise((resolve) => {
          diffExisting.forEach((tag, i) => {
            const tagData = tag as any;
            this.deletePostToTagByIdGQL.mutate({
              id: tagData.id
            }).subscribe(
              result => {
                // console.log(result);

                // if the last tag deleted then cont
                if (i === diffExisting.length - 1) {
                  // send these off to create tags mutation
                  this.createTagsMutation(this.data.id, diffNew).then(
                    () => resolve()
                  );
                }
              }
            );
          });
        });
        promiseArr.push(promise2);
      }

      Promise.all(promiseArr).then(() => {
        resolve();
      });
    });
  }

  comparePhotos() {
    return new Promise((resolve, reject) => {
      const promiseArr = [];

      // first see if lead photos title or url changed
      let leadTitleChanged = false;
      let leadURLChanged = false;

      if (this.data.imagesByPostId.nodes[0].title !== this.postModel.leadPhotoTitle) {
        leadTitleChanged = true;
      }
      if (this.data.imagesByPostId.nodes[0].url !== this.leadPhotoLinks[0].url) {
        leadURLChanged = true;
      }

      if (leadTitleChanged || leadURLChanged) {
        // update both large and small image
        let query = `mutation {`;
        this.leadPhotoLinks.forEach((link, i) => {
          query += `a${i}: updateImageById(
            input: {
              id: ${this.data.imagesByPostId.nodes[i].id},
              imagePatch:{
                url: "${link.url}",
                title: "${this.postModel.leadPhotoTitle}"
              }
            }
          ) {
            clientMutationId
          }
        `;
        });
        query += `}`;

        const promise = new Promise((resolve) => {
          this.apiService.genericCall(query).subscribe(
            result => resolve(result),
            err => console.log(err)
          );
        });
        promiseArr.push(promise);
      }

      // next check out if gallery photos are different
      const newPhotoArr: GalleryPhoto[] = this.galleryPhotos.filter((img) => !img.id );
      const promise = new Promise((resolve) => {
        this.createGalleryPhotoLinks(this.data.id, newPhotoArr).then(
          () => {
            // update edited gallery photos
            // make sure 'new' photos not on 'edited' arr
            const filteredEditedArr = this.galleryItemHasChanged.filter((img => newPhotoArr.indexOf(img) === -1));
            // then bulk update imgs
            if (filteredEditedArr.length) {
              let query = `mutation {`;
              filteredEditedArr.forEach((img, i) => {
                query += `a${i}: updateImageById(
                  input: {
                    id: ${img.id},
                    imagePatch:{
                      url: "${img.photoUrl}",
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
      promiseArr.push(promise);

      Promise.all(promiseArr).then(() => {
        resolve();
      });
    });
  }

  async presentPopover(e) {
    const popover = await this.popoverCtrl.create({
      component: PostTypePopoverComponent,
      componentProps: { options: this.postOptions },
      cssClass: 'postTypePopover',
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      this.activePostOption = data;
    }
  }

  async presentImageUploaderPopover(type: string): Promise<{ url: string, size: number }[]> {
    return new Promise(async (resolve) => {
      const popover = await this.popoverCtrl.create({
        component: ImageUploaderPopoverComponent,
        componentProps: { type },
        cssClass: 'imageUploaderPopover',
        backdropDismiss: false
      });

      await popover.present();

      const { data } = await popover.onWillDismiss();
      if (data) {
        // return arr of images (in this case one)
        resolve(data);
      }
    });
  }

  async presentGalleryPopover(e, index: number) {
    const popover = await this.popoverCtrl.create({
      component: GalleryImgActionPopoverComponent,
      componentProps: { model: this.galleryPhotos[index] },
      cssClass: 'galleryImgActionPopover',
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      if (data.action === 'delete') {
        this.alertService.confirm(
          'Delete Gallery Image',
          'Are you sure you want to delete permanently delete this image?',
          { label: 'Delete', handler: () =>  {
            // if photo has already been saved to db
            if (this.galleryPhotos[index].id) {
              this.deleteImageByIdGQL.mutate({
                id: this.galleryPhotos[index].id
              }).subscribe(
                () => {
                  this.galleryPhotos.splice(index, 1);
                  this.toast('Gallery image deleted');
                }
              );
            } else {
              this.galleryPhotos.splice(index, 1);
              this.toast('Gallery image deleted');
            }
          }}
        );
      } else {
        // update photo
        this.galleryPhotos[index] = data.data;
        this.galleryItemHasChanged.push(this.galleryPhotos[index]);
      }
    }
  }

  async presentGalleryUploaderPopover() {
    if (this.galleryPhotos.length === 12) {
      this.alertService.alert(
        'Gallery Full',
        'Only 12 images per gallery maximum. Please delete a few to add more.'
      );
    } else {
      const popover = await this.popoverCtrl.create({
        component: ImageUploaderPopoverComponent,
        componentProps: {
          type: 'gallery',
          existingPhotos: this.galleryPhotos.length,
          max: 12
        },
        cssClass: 'imageUploaderPopover',
        backdropDismiss: false
      });

      await popover.present();

      const { data } = await popover.onWillDismiss();
      if (data) {
        if (data === 'maxErr') {
          this.alertService.alert(
            'Gallery Max Exceeded',
            'Please reduce the number of images in the gallery to 12 or less'
          );
        } else {
          data.forEach(({ url }) => {
            this.galleryPhotos.push({
              id: null,
              photoUrl: url,
              description: ''
            });
          });
        }
      }
    }
  }

  async presentLeadUploaderPopover() {
    const popover = await this.popoverCtrl.create({
      component: ImageUploaderPopoverComponent,
      componentProps: { type: 'lead' },
      cssClass: 'imageUploaderPopover',
      backdropDismiss: false
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data) {
      this.leadPhotoLinks = data;
      this.displayedLeadPhoto = this.selectSmallLeadPhoto(this.leadPhotoLinks);
    }
  }

  async presentDatepickerModal(e: Event) {
    e.stopPropagation();

    if (this.postOptions[this.activePostOption].name !== 'Draft') {
      const modal = await this.modalController.create({
        component: DatePickerModalComponent,
        componentProps: {
          date: this.postOptions[this.activePostOption].name === 'Scheduled'
            ? this.scheduledModel.value
            : this.publishModel.value
        },
        cssClass: 'datepickerModal'
      });

      await modal.present();

      const { data } = await modal.onWillDismiss();
      if (data) {
        if (this.postOptions[this.activePostOption].name === 'Scheduled') {
          this.scheduledModel.label = moment(data).fromNow();
          this.scheduledModel.value = Date.parse(data);
        } else {
          this.publishModel.label = moment(data).fromNow();
          this.publishModel.value = Date.parse(data);
        }
      }
    }
  }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  addTag(data: Tag) {
    let exists = false;
    this.tagOptions.forEach((tag) => {
      if (tag.name === data.name) {
        exists = true;
      }
    });
    if (!exists) {
      this.tagOptions.push(data);
    }
  }

  removeTag(i: number) {
    this.tagOptions.splice(i, 1);
  }

  populateJunctures() {
    if (this.postModel.tripId !== 'null') {
      this.junctureOptions = this.tripOptions.filter((option) => {
        return option.id === +this.postModel.tripId;
      })[0].juncturesByTripId.nodes;
    } else {
      this.postModel.junctureId = null;
      this.junctureOptions = [];
    }
  }

  populateLocation() {
    const selectedJuncture = this.junctureOptions.filter((option) => {
      return option.id === +this.postModel.junctureId;
    })[0];
    this.postModel.city = selectedJuncture.city;
    this.postModel.country = selectedJuncture.country;
  }

  useCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location: any) => {
        this.apiService.reverseGeocodeCoords(location.coords.latitude, location.coords.longitude).subscribe(
          result => {
            // use zone to force update
            this.ngZone.run(() => {
              this.postModel.city = this.utilService.extractCity(result.formattedAddress.address_components);
              this.postModel.country = result.country.address_components[0].short_name;
            });
          }
        );
      });
    } else {
      this.alertService.alert('Error', 'Enable geolocation to use current location');
    }
  }
}

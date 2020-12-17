import { Component, OnDestroy } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

import { CreatePostModalComponent } from '../../../components/createPostModal/createPostModal';

import { RouterService } from '../../../services/router.service';
import { SettingsService } from '../../../services/settings.service';
import { UserService } from '../../../services/user.service';
import { AppService } from '../../../services/app.service';

import { SubscriptionLike } from 'rxjs';
import { PostByIdGQL, DeletePostByIdGQL, AllPostsByUserGQL } from 'src/app/generated/graphql';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  tabOptions: string[] = ['all', 'drafts', 'published']; // scheduled removed for now
  activeTab = 0;
  isExpanded = false;
  postsData: any;
  posts = [];
  displayedPosts = [];
  activePost: number = null;
  isPreview = false;
  previewedPost;
  // searchQuery: string;

  initSubscription: SubscriptionLike;

  constructor(
    public routerService: RouterService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private settingsService: SettingsService,
    private userService: UserService,
    private appService: AppService,
    private postByIdGQL: PostByIdGQL,
    private deletePostByIdGQL: DeletePostByIdGQL,
    private allPostsByUserGQL: AllPostsByUserGQL
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
    this.settingsService.modPageMeta(
      'Blog Dashboard',
      `Create, edit, and share your own stories with Pack On My Back\'s blog generation tool. \
      Make beautiful representations of your experiences to share and look back on.`
    );
    this.postsData = this.allPostsByUserGQL.fetch({
      author: this.userService.user.id
    }).subscribe(
      ({ data }) => {
        this.posts = data.allPosts.nodes;
        console.log(this.posts);
        this.displayedPosts = data.allPosts.nodes;
      });
  }

  changeTab(index: number) {
    this.activeTab = index;
    this.activePost = null;

    switch (index) {
      case 0:
        this.displayedPosts = this.posts;
        break;
      case 1:
        this.displayedPosts = this.posts.filter((post) => (post.isDraft));
        break;
      // case 2:
      // this.displayedPosts = this.posts.filter((post) => (post.isScheduled));
      //   break;
      case 2:
        this.displayedPosts = this.posts.filter((post) => (post.isPublished));
        break;
    }
  }

  launchPostEditor(post) {
    // bit of a dumb hack, but it keeps launch modal on update otherwise
    let launch = true;
    const self = this;
    if (post) {
      this.postByIdGQL.fetch({
        id: post.id,
        userId: this.userService.user.id
      }).subscribe(
        ({ data }) => {
          if (launch) {
            launchModal(data.postById);
          }
          launch = false;
        }
      );
    } else {
      launchModal(null);
    }

    async function launchModal(post: any) {
      const modal = await self.modalCtrl.create({
        component: CreatePostModalComponent,
        componentProps: { post },
        cssClass: 'createPostModal',
        backdropDismiss: false
      });

      await modal.present();

      const { data } = await modal.onWillDismiss();
      if (data) {
        if (data.type === 'deleted') {
          self.deletePost(post);
        } else {
          self.toast(`Post ${data.title} ${data.type}`);
        }
      }
    }
  }

  deletePost(post) {
    // if not post passed in it means it wasn't saved yet anyway no need for api call
    if (post) {
      this.deletePostByIdGQL.mutate({
        id: post.id
      }).subscribe(
        ({ data }) => {
          this.toast(`Post "${data.deletePostById.post.title}" successfully deleted`);
        }
      );
    }
  }

  async deleteConfirm(post) {
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
            this.deletePost(post);
          }
        }
      ]
    });

    await alert.present();
  }

  previewPost(post) {
    this.postByIdGQL.fetch({
      id: post.id,
      userId: this.userService.user.id
    }).subscribe(
      ({ data }) => {
        this.previewedPost = data.postById;
        this.isPreview = true;
      }
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

  // searchPosts() {
  //   console.log(this.searchQuery);
  //   if (this.searchQuery) {
  //     this.apiService.searchPosts(this.searchQuery).valueChanges.subscribe(
  //       result => {
  //         this.posts = result.data.searchPosts.nodes;
  //         this.searchQuery = '';
  //       }
  //     );
  //   }
  // }
}

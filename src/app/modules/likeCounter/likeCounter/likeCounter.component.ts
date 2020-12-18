import { Component, Input } from '@angular/core';

import { SettingsService } from '../../../services/settings.service';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { DeleteLikeByIdGQL, CreateLikeGQL } from 'src/app/generated/graphql';

@Component({
  selector: 'app-like-counter',
  templateUrl: './likeCounter.component.html',
  styleUrls: ['./likeCounter.component.scss']
})
export class LikeCounterComponent {
  @Input() totalLikes: number;
  @Input() userLikes: { id: number }[] = []; // whether user likes asset
  @Input() assetId: number;
  @Input() assetType: 'trip' | 'juncture' | 'post' | 'image';
  @Input() isVertical = true;
  @Input() hasLabel = false;
  @Input() color = '#bbb';

  constructor(
    public settingsService: SettingsService,
    private userService: UserService,
    private alertService: AlertService,
    private deleteLikeByIdGQL: DeleteLikeByIdGQL,
    private createLikeGQL: CreateLikeGQL
  ) { }

  toggleLike() {
    if (this.userLikes.length) {
      // need to delete the existing like
      this.deleteLikeByIdGQL.mutate({
        likeId: this.userLikes[0].id
      }).subscribe(
        () => {
          this.userLikes = [];
          this.totalLikes--;
        }
      );
    } else {
      if (this.userService.user) {
        // need to add a like
        this.createLikeGQL.mutate({
          tripId : this.assetType === 'trip' ? this.assetId : null,
          junctureId : this.assetType === 'juncture' ? this.assetId : null,
          postId : this.assetType === 'post' ? this.assetId : null,
          imageId : this.assetType === 'image' ? this.assetId : null,
          userId : this.userService.user.id
        }).subscribe(
          ({ data }) => {
            this.totalLikes++;
            this.userLikes = [data.createLike.likeEdge.node];
          }
        );
      } else {
        this.alertService.alert('Log In', `You must be logged in to like this ${this.assetType}`);
      }
    }
  }
}

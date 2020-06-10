import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';

import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
import { DeleteAccountGQL } from '../../generated/graphql';

@Component({
  selector: 'DeleteAccountModal',
  templateUrl: 'deleteAccountModal.html',
  styleUrls: ['./deleteAccountModal.scss']
})
export class DeleteAccountModalComponent {

  username: string;

  constructor(
    public modalCtrl: ModalController,
    public userService: UserService,
    private routerService: RouterService,
    private apollo: Apollo,
    private deleteAccountGQL: DeleteAccountGQL
  ) { }

  delete() {
    this.deleteAccountGQL.mutate({
      userId: this.userService.user.id
    }).subscribe(
      () => {
        this.userService.signedIn = false;
        // reset apollo cache and refetch queries
        this.apollo.getClient().resetStore();
        localStorage.removeItem('pomb-user');
        this.modalCtrl.dismiss();
        this.routerService.navigateToPage('/');
        // reload window to update db role
        window.location.reload();
      }
    );
  }
}

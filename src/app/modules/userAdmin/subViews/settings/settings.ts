import { Component, ViewChild } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';

import { SettingsService } from '../../../../services/settings.service';
import { RouterService } from '../../../../services/router.service';
import { UserService } from '../../../../services/user.service';
import { AlertService } from '../../../../services/alert.service';

import { DeleteAccountModalComponent } from '../../../../shared/deleteAccountModal/deleteAccountModal';
import { UpdatePasswordGQL } from '../../../../generated/graphql';

@Component({
  selector: 'page-useradmin-settings',
  templateUrl: 'settings.html',
  styleUrls: ['./settings.scss']
})
export class UserAdminSettingsPage {
  @ViewChild('changeForm') form;

  changeModel = { currentPassword: '', newPassword: '', confirmPassword: '' };

  constructor(
    public settingsService: SettingsService,
    public routerService: RouterService,
    private userService: UserService,
    private toastCtrl: ToastController,
    private alertService: AlertService,
    private modalCtrl: ModalController,
    private updatePasswordGQL: UpdatePasswordGQL
  ) {  }

  changePassword({ currentPassword, newPassword }) {
    this.updatePasswordGQL.mutate({
      userId: this.userService.user.id,
      password: currentPassword,
      newPassword
    }).subscribe(
      async ({ data }) => {
        if (data.updatePassword.boolean) {
          const toast = await this.toastCtrl.create({
            message: 'Password changed',
            duration: 3000,
            position: 'top'
          });

          toast.present();
          this.form.reset();
        } else {
          this.alertService.alert(
            'Password Change Failed',
            'Something went wrong. Make sure you have the correct current password'
          );
        }
      }
    );
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: DeleteAccountModalComponent,
      cssClass: 'deleteAccountModal'
    });

    await modal.present();
  }
}

import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Confirm {
  label: string;
  handler: () => void;
}

@Injectable()
export class AlertService {

  constructor(
    private alertCtrl: AlertController
  ) {

  }

  async alert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }

  async confirm(header: string, message: string, confirmBtn: Confirm) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: confirmBtn.label,
          handler: () => {
            confirmBtn.handler();
          }
        }
      ]
    });
    await alert.present();
  }
}

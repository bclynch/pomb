import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';
import { SettingsService } from '../../../services/settings.service';
import { APIService } from '../../../services/api.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnDestroy {

  contactModel = { why: null, name: '', email: '', content: '' };

  whyOptions: { label: string; value: string; }[] = [
    { label: 'I need technical support / I found a bug', value: 'support' },
    { label: 'I need help figuring out how something works', value: 'question' },
    { label: 'I have some feedback about the application', value: 'feedback' },
    { label: 'Other', value: 'other' }
  ];

  initSubscription: SubscriptionLike;

  constructor(
    public settingsService: SettingsService,
    public sanitizer: DomSanitizer,
    private apiService: APIService,
    private toastCtrl: ToastController,
    private appService: AppService
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
      'Contact',
      'Contact Pack On My Back with questions, concerns, or just a friendly hello.'
    );
  }

  submitContact() {
    this.apiService.sendContactEmail(this.contactModel).subscribe(
      () => {
        this.contactModel = { why: null, name: '', email: '', content: '' };
        this.toast('Contact request sent');
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
}

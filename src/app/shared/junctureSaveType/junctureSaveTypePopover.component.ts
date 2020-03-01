import { Component } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'JunctureSaveTypePopover',
  templateUrl: 'junctureSaveTypePopover.component.html'
})
export class JunctureSaveTypePopover {

  options;

  constructor(
    public popoverCtrl: PopoverController,
    private params: NavParams
  ) {
    this.options = params.get('options');
  }

  selectOption(option: string) {
    this.popoverCtrl.dismiss(option);
  }
}

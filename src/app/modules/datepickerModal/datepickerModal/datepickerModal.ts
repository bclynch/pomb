
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, NavParams } from '@ionic/angular';
import { SettingsService } from '../../../services/settings.service';
import * as moment from 'moment';

interface DateItem {
  isSelected: boolean;
  momentDate: moment.Moment;
  isEnabled: boolean;
}

@Component({
  selector: 'app-datepicker-modal',
  templateUrl: './datepickerModal.html',
  styleUrls: ['./datepickerModal.scss']
})
export class DatePickerModalComponent {

  currentMoment: moment.Moment;
  daysGroupedByWeek = [];
  private selectedDateItem: DateItem;
  private daysOfMonth: DateItem[];
  private calendarModal;

  timeModel = { hour: null, minutes: null };

  constructor(
    public modalCtrl: ModalController,
    private params: NavParams,
    public sanitizer: DomSanitizer,
    public settingsService: SettingsService
  ) {
    this.currentMoment = moment(this.params.data.date);
    this.renderCalender();
  }

  private renderCalender() {
    this.daysOfMonth = this.generateDaysOfMonth(
      this.currentMoment.year(),
      this.currentMoment.month() + 1,
      this.currentMoment.date()
    );
    this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth);
    this.generateTime();

    this.setDefaultSelectedDate();
  }

  private generateDaysOfMonth(year: number, month: number, day: number) {
    const calendarMonth = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');

    const startOfMonth = calendarMonth.clone().startOf('month').day('sunday');
    const endOfMonth = calendarMonth.clone().endOf('month').day('saturday');

    const totalDays = endOfMonth.diff(startOfMonth, 'days') + 1;

    const calendarDays: DateItem[] = [];

    for (let i = 0; i < totalDays; i++) {
      const immunableStartOfMonth = startOfMonth.clone();

      const dateItem: DateItem = {
        isSelected: false,
        momentDate: immunableStartOfMonth.add(i, 'day'),
        isEnabled: this.isBelongToThisMonth(immunableStartOfMonth, month)
      };

      calendarDays.push(dateItem);
    }

    return calendarDays;
  }

  private groupByWeek(daysOfMonth: DateItem[]) {

    const groupedDaysOfMonth = new Array<DateItem[]>();

    daysOfMonth.forEach((item, index) => {


      const groupIndex = Math.floor((index / 7));

      groupedDaysOfMonth[groupIndex] = groupedDaysOfMonth[groupIndex] || [];

      groupedDaysOfMonth[groupIndex].push(item);


    });

    return groupedDaysOfMonth;

  }

  selectDate(day: DateItem) {

    if (!day.isEnabled) {
      return;
    }

    if (this.selectedDateItem && this.selectedDateItem.isSelected) {
      this.selectedDateItem.isSelected = false;
    }

    day.isSelected = true;
    this.selectedDateItem = day;
    this.currentMoment = day.momentDate.clone();

  }

  private setDefaultSelectedDate() {
    const date = this.currentMoment.startOf('day');
    const foundDates = this.daysOfMonth
      .filter((item: DateItem) => date.isSame(item.momentDate.clone().startOf('day')));

    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0];
      this.selectedDateItem.isSelected = true;
    }

  }

  private isBelongToThisMonth(momentDate: moment.Moment, month: number) {

    return momentDate.month() + 1 === month;
  }

  setMonthBack() {
    this.currentMoment.subtract(1, 'month');
    this.renderCalender();

  }

  setMonthForward() {
    this.currentMoment.add(1, 'month');
    this.renderCalender();
  }

  setYearBack() {
    this.currentMoment.subtract(1, 'year');
    this.renderCalender();
  }
  setYearForward() {
    this.currentMoment.add(1, 'year');
    this.renderCalender();
  }

  confirmDateSelection() {
    const combinedDate = this.selectedDateItem.momentDate
      .add(this.timeModel.hour, 'hours')
      .add(this.timeModel.minutes, 'minutes');
    this.modalCtrl.dismiss(combinedDate.toDate());
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  private generateTime() {
    const date = new Date(this.params.data.date);
    this.timeModel.hour = date.getHours();
    this.timeModel.minutes = date.getMinutes();
  }
}

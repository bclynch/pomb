import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface BroadcastEvent {
  name: string;
  message: any;
}

@Injectable()
export class BroadcastService {

  private observable: Observable<any>;
  private observer: Observer<any>;

  constructor() {
    this.observable = Observable
      .create(observer => this.observer = observer)
      .share();
  }

  broadcast(event: BroadcastEvent) {
    this.observer.next(event);
  }

  on(eventName: string, callback: any) {
    this.observable.pipe(
      filter(event => event.name === eventName))
      .subscribe(callback);
  }
}

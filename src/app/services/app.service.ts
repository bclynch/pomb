import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { UserService } from './user.service';
import { SettingsService } from './settings.service';
import { CurrentAccountGQL } from '../generated/graphql';
import { LocalStorageService } from './localStorage.service';

@Injectable()
export class AppService {
  public appInited: Observable<any>;
  private _subject: BehaviorSubject<any>;

  firstTry = true;

  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
    private currentAccountGQL: CurrentAccountGQL,
    private localStorageService: LocalStorageService
  ) {
    this._subject = new BehaviorSubject<boolean>(false);
    this.appInited = this._subject;
  }

  appInit() {
    // grab site config
    this.settingsService.appInit().then(() => {
      this.settingsService.appInited = true;

      this.currentAccountGQL.fetch().subscribe(({ data }: any) => {
        // checking in to snag user data
        console.log('got user data', data);
        if (data.currentAccount) {
          this.userService.signedIn = true;
          this.userService.user = data.currentAccount;
          this.userService.init().then(() => {
            this._subject.next(true);
            this.firstTry = false;
          },
          err => console.log('err', err));
        } else {
          // if it doesnt exist dump the token
          if (this.firstTry) {
            this.localStorageService.set('pomb-user', null);
          }
          this._subject.next(true);
          this.firstTry = false;
        }
      }, (error) => {
        // console.log('there was an error sending the query', error);
        this.localStorageService.set('pomb-user', null);
        // alertService.alert('Internal Error', 'There was a problem with our servers, please be patient!');
        this._subject.next(true);
      });
    }, error => {
      console.log(error);
      // JWT expired so get rid of it in local storage
      this.localStorageService.set('pomb-user', null);
      this._subject.next(true);
      // window.location.reload();
    });
  }
}

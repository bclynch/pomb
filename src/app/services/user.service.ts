import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  RecentUserActivityGQL,
  AuthAdminAccountGQL,
  AuthUserAccountGQL,
  RegisterUserAccountGQL,
  Account
} from '../generated/graphql';
import { APIService } from './api.service';
import { LocalStorageService } from './localStorage.service';
import { AlertService } from './alert.service';

import { Registration } from '../models/Registration.model';
import { Login } from '../models/Login.model';
import { User } from '../models/User.model';

@Injectable()
export class UserService {
  signedIn = false;
  user: Account = null;

  // for use in our nav panel
  recentTrip;
  recentJunctures;
  recentPosts;

  constructor(
    private apiService: APIService,
    private apollo: Apollo,
    private localStorageService: LocalStorageService,
    private alertService: AlertService,
    private router: Router,
    private recentUserActivityGQL: RecentUserActivityGQL,
    private authAdminAccountGQL: AuthAdminAccountGQL,
    private authUserAccountGQL: AuthUserAccountGQL,
    private registerUserAccountGQL: RegisterUserAccountGQL,
  ) { }

  init() {
    return new Promise<void>((resolve, reject) => {
      this.recentUserActivityGQL.fetch({
        username: this.user.username
      }).subscribe(
        ({ data: { accountByUsername } = {} }) => {
          this.recentTrip = accountByUsername.tripsByUserId.nodes[0];
          this.recentJunctures = accountByUsername.juncturesByUserId.nodes;
          this.recentPosts = accountByUsername.postsByAuthor.nodes;
          resolve();
        },
        (err) => reject(err)
      );
    });
  }

  loginUser({ email, password }) {
    this.authUserAccount({ email, password }).then((token) => {
      // need to get current user function rolling for other pertinent info
      const userObj: any = {};
      userObj.token = token;

      // save user to local storage
      this.localStorageService.set('pomb-user', userObj);

      // reload window to update db role
      window.location.reload();
    }, () => {
      this.alertService.alert(
        'Invalid Login',
        'The email or password is incorrect. Please check your account information and login again'
      );
    });
  }

  logoutUser() {
    this.signedIn = false;
    // reset apollo cache and refetch queries
    this.apollo.getClient().resetStore();
    localStorage.removeItem('pomb-user');
    // this.router.navigateByUrl('/');
    // reload window to update db role
    window.location.reload();
  }

  loginAdminUser({ email, password }) {
    this.authAdminAccount({ email, password }).then((token) => {
      // need to get current user function rolling for other pertinent info
      const userObj: any = {};
      userObj.token = token;

      // save user to local storage
      this.localStorageService.set('pomb-user', userObj);

      this.router.navigateByUrl('/admin');
      // reload window to update db role
      setTimeout(() => window.location.reload(), 2000);
    }, () => {
      this.alertService.alert(
        'Invalid Login Or Logged In As Other User',
        `The email or password is incorrect. Please check your account information and \
        login again OR log out of current account before logging in here`
      );
    });
  }

  private authUserAccount({ email, password }: Login): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.authUserAccountGQL.mutate({
        email,
        password
      }).subscribe(({ data }) => {
        // console.log('got data', data);
        const authData = data;
        if (authData.authenticateUserAccount.jwtToken) {
          this.signedIn = true;
          // reset apollo cache and refetch queries
          this.apollo.getClient().resetStore();
          resolve(authData.authenticateUserAccount.jwtToken);
        } else {
          // incorrect login warning
          reject('invalid login');
        }
      }, (error) => {
        console.log('there was an error sending the query', error);
        reject(error);
      });
    });
  }

  registerUserAccount({ username, firstName, lastName, password, email }: Registration) {
    this.registerUserAccountGQL.mutate({
      username,
      firstName,
      lastName,
      password,
      email
    }).subscribe(({ data }) => {
      const userObj = data as any;

      // send welcome registration email
      this.apiService.sendRegistrationEmail(email).subscribe(
        result => {}
      );

      // auth to snag token
      this.authUserAccount({ email, password }).then((token) => {
        userObj.token = token;
        // save user token to local storage
        this.localStorageService.set('pomb-user', userObj);

        // reload window to update db role
        window.location.reload();
      }, () => {
        console.log('err');
      });
    }, err => {
      switch (err.message) {
        case 'GraphQL error: duplicate key value violates unique constraint "account_username_key"':
          this.alertService.alert(
            'Invalid Registration',
            'That username already exists, please select a new one!'
          );
          break;
        case 'GraphQL error: duplicate key value violates unique constraint "user_account_email_key"':
          this.alertService.alert(
            'Invalid Registration',
            'The selected email already exists. Try resetting your password or use a new email address.'
          );
          break;
        case 'GraphQL error: permission denied for function register_account':
          this.alertService.alert(
            'Submission Error',
            `Looks like you\'re still logged into another account. Make sure you\'re logged out or \
            reload the page and try again`
          );
          break;
        default:
          this.alertService.alert(
            'Invalid Registration',
            'There is an issue submitting your registration. Please reload and try again'
          );
      }
    });
  }

  private authAdminAccount({ email, password }: Login): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.authAdminAccountGQL.mutate({
        email,
        password
      }).subscribe(({ data }) => {
        const authData = data;
        if (authData.authenticateAdminAccount.jwtToken) {
          this.signedIn = true;
          // reset apollo cache and refetch queries
          this.apollo.getClient().resetStore();
          resolve(authData.authenticateAdminAccount.jwtToken);
        } else {
          // incorrect login warning
          reject('invalid login');
        }
      }, (error) => {
        console.log('there was an error sending the query', error);
        reject(error);
      });
    });
  }
}

import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { DomSanitizer } from '@angular/platform-browser';

// import { DashboardService } from '../../../services/dashboard.service';
import { UserService } from '../../services/user.service';
import { AppService } from '../../services/app.service';
import { SettingsService } from '../../services/settings.service';
import { RouterService } from '../../services/router.service';
import { SubscriptionLike } from 'rxjs';

interface ListOption {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage implements OnDestroy {

  navListOptions: ListOption[] = [
    { label: 'Dashboard', icon: 'pulse', path: 'dashboard' },
    { label: 'Configuration', icon: 'hammer', path: 'config' },
    { label: 'Users', icon: 'person', path: 'users' },
    { label: 'Posts', icon: 'file-tray-full', path: 'posts' },
    { label: 'Log Out', icon: 'log-out', path: null }
  ];
  activeDashView: string;
  storeId: number;
  displayMenuToggle = true;
  dataReady = false;

  initSubscription: SubscriptionLike;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private userService: UserService,
    private apollo: Apollo,
    private appService: AppService,
    public settingsService: SettingsService,
    private routerService: RouterService,
    public sanitizer: DomSanitizer,
  ) {
    this.activeDashView = this.routerService.fragment || 'dashboard';
    this.dataReady = true;
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.init();
        }
      }
    );
  }

  init() {
    this.settingsService.modPageMeta('Admin Dashboard', 'Administrative dashboard for Pack On My Back');
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  openMenu() {
    this.menuCtrl.open();
  }

  navigate(path) {
    if (path) {
      this.routerService.modifyFragment(path);
      this.activeDashView = path;
      this.menuCtrl.close();
    } else {
      this.userService.signedIn = false;
      // reset apollo cache and refetch queries
      this.apollo.getClient().resetStore();
      localStorage.removeItem('pomb-user');
      this.router.navigateByUrl(`/`);
      window.location.reload();
    }
  }

  menuBtnState(state) {
    this.displayMenuToggle = state;
  }
}

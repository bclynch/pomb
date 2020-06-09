import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ExploreService } from './explore.service';
import { LocalStorageService } from './localStorage.service';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AllConfigsGQL, RecentImagesGQL } from '../generated/graphql';

interface FeaturedStory {
  id: number;
  title: string;
  subtitle: string;
  imgURL: string;
}

@Injectable()

export class SettingsService {

  appInited = false;
  primaryColor: string;
  secondaryColor: string;
  tagline: string;
  heroBanner: string;
  featuredStories: FeaturedStory[];
  featuredTrip;
  recentPhotos;

  private unitOfMeasureSubject: BehaviorSubject<void>;
  public unitOfMeasure$: Observable<void>;
  public unitOfMeasure: 'imperial' | 'metric';

  siteSections = {
    Community: { subSections: ['Community Hub', 'Featured Trip'] },
    Stories: { subSections: ['trekking', 'biking', 'travel', 'culture', 'gear', 'food'] },
    'My Pack': { subSections: [
      'Profile',
      'Create Trip',
      'Create Juncture',
      'Blog Dashboard',
      'Tracking',
      'User Dashboard'
    ] }
  };

  constructor(
    private exploreService: ExploreService,
    private localStorageService: LocalStorageService,
    private titleService: Title,
    private userService: UserService,
    private meta: Meta,
    private allConfigsGQL: AllConfigsGQL,
    private recentImagesGQL: RecentImagesGQL
  ) {
    this.unitOfMeasureSubject = new BehaviorSubject(null);
    this.unitOfMeasure$ = this.unitOfMeasureSubject.asObservable();
    this.unitOfMeasure = 'imperial';
  }

  appInit() {
    const promises = [];

    // check local storage for unit of measure
    const unitType = this.localStorageService.get('unitOfMeasure');
    if (unitType) {
      this.changeUnitOfMeasure(unitType);
    } else {
      this.localStorageService.set('unitOfMeasure', this.unitOfMeasure);
    }

    // countries data
    promises.push(this.exploreService.init());

    const promise2 = new Promise<string>((resolve, reject) => {
      this.allConfigsGQL.fetch().subscribe(
        data => {
          const {
            primaryColor,
            secondaryColor,
            tagline,
            heroBanner,
            tripByFeaturedTrip1,
            postByFeaturedStory1,
            postByFeaturedStory2,
            postByFeaturedStory3
          } = data.data.allConfigs.nodes[0];
          this.primaryColor = primaryColor;
          this.secondaryColor = secondaryColor;
          this.tagline = tagline;
          this.heroBanner = heroBanner;
          this.featuredTrip = tripByFeaturedTrip1;
          this.addFeaturedStory([postByFeaturedStory1, postByFeaturedStory2, postByFeaturedStory3]);

          // get photos for nav
          this.recentImagesGQL.fetch({
            last: 5,
            userId: this.userService.user ? this.userService.user.id : null
          }).subscribe(
            ({ data }) => {
              this.recentPhotos = data.allImages.nodes;
              resolve();
            }
          );
        },
        err => reject(err)
      );
    });
    promises.push(promise2);

    return Promise.all(promises);
  }

  changeUnitOfMeasure(unitType: 'imperial' | 'metric') {
    this.unitOfMeasure = unitType;
    this.unitOfMeasureSubject.next(null);
  }

  addFeaturedStory(stories: any[]) {
    this.featuredStories = stories.map((story) => {
      if (story) {
        const { id, title, subtitle, imagesByPostId } = story;
        return { id, title, subtitle, imgURL: imagesByPostId.nodes[0].url };
      } else {
        return null;
      }
    });
  }

  modPageMeta(title: string, description: string) {
    this.titleService.setTitle(`Pack On My Back - ${title}`);
    this.meta.addTag({ name: 'description', content: description });
  }
}

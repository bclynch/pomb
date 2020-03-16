import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterService } from '../../../services/router.service';
import { SettingsService } from '../../../services/settings.service';
import { SearchSiteGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  postResults = [];
  tripResults = [];
  accountResults = [];
  query: string;

  constructor(
    public routerService: RouterService,
    public settingsService: SettingsService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private searchSiteGQL: SearchSiteGQL
  ) {
    this.route.queryParams.subscribe((params) => {
      this.query = params.q;
      this.runSearch();
    });

    this.settingsService.modPageMeta(
      'Search Results',
      `See user, trip, and juncture results for the query ${this.query}`
    );
  }

  runSearch(): void {
    // using :* to it'll be an open ended search
    this.searchSiteGQL.fetch({
      query: `${this.query}:*`
    }).subscribe(
      ({ data }) => {
        console.log('SEARCH RESULTS: ', data);
        this.postResults = data.searchPosts.nodes;
        this.tripResults = data.searchTrips.nodes;
        this.accountResults = data.searchAccounts.nodes;

        // maybe we run followup query for the missing data we need aka post img, post author, trip img, etc
      }
    );
  }

}

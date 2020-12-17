import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { SearchCountriesGQL } from '../../generated/graphql';

interface CountryResult { code: string; name: string; }

@Component({
  selector: 'app-country-search',
  templateUrl: 'countrySearch.component.html',
  styleUrls: ['./countrySearch.component.scss']
})
export class CountrySearchComponent {
  @Output() selectCountry: EventEmitter<CountryResult> = new EventEmitter<CountryResult>();

  search = new FormControl();
  value = '';
  searchResults: CountryResult[] = [];

  constructor(
    private searchCountriesGQL: SearchCountriesGQL
  ) {
    this.search.valueChanges
      .pipe(debounceTime(250))
      .subscribe(query => {
        if (query) {
          this.searchCountriesGQL.fetch({ query }).subscribe(
            ({ data }) => {
              // limiting to 5 results
              // TODO can do on the search country call itself...
              this.searchResults = data.searchCountries.nodes.slice(0, 5);
            }
          );
        } else {
          this.searchResults = [];
        }
      });
  }

  submitQuery() {
    // debouncing a second so search results have a sec to catch up
    setTimeout(() => {
      if (this.searchResults.length && this.value.toLowerCase() === this.searchResults[0].name.toLowerCase()) {
        this.selectCountry.emit(this.searchResults[0]);
        this.value = '';
        this.searchResults = [];
      }
    }, 400);
  }

  onSelectCountry(country: CountryResult) {
    this.selectCountry.emit(country);
    this.value = '';
    this.searchResults = [];
  }
}

import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchTagsGQL } from '../../generated/graphql';
import { debounceTime } from 'rxjs/operators';

interface Tag {
  name: string;
  exists: boolean;
}

@Component({
  selector: 'app-tag-search',
  templateUrl: 'tagSearch.component.html',
  styleUrls: ['./tagSearch.component.scss']
})
export class TagSearchComponent {
  @Output() selectTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  search = new FormControl();
  value = '';
  searchResults: string[] = [];

  constructor(
    private searchTagsGQL: SearchTagsGQL
  ) {
    this.search.valueChanges
      .pipe(debounceTime(250))
      .subscribe(query => {
        if (query) {
          this.searchTagsGQL.fetch({
            query
          }).subscribe(
            ({ data }) => {
              // limiting to 5 results
              this.searchResults = data.searchTags.nodes.slice(0, 5).map(({ name }) => name);
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
      // if it equals the name of the search result we will use this to not add to db again because it already exists
      if (this.searchResults.length && this.value.toLowerCase() === this.searchResults[0]) {
        this.selectTag.emit({ name: this.searchResults[0], exists: true });
      } else {
        this.selectTag.emit({ name: this.value.toLowerCase(), exists: false });
      }
      this.value = '';
      this.searchResults = [];
    }, 400);
  }

  onSelectTag(name: string) {
    this.selectTag.emit({ name: name.toLowerCase(), exists: true });
    this.value = '';
    this.searchResults = [];
  }
}

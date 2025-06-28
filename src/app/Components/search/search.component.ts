import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';

interface MediaItem {
  id: number;
  media_type: string;
  poster_path: string;
  name?: string;
  original_title?: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  allData: MediaItem[] = [];
  found: boolean = true;
  target: string = '';
  searchType: string = 'multi';

  constructor(
    private _DataService: DataService,
    private _ActivatedRoute: ActivatedRoute,
    private Spinner: NgxSpinnerService,
    private _Router: Router
  ) {}

ngOnInit(): void {
  this._ActivatedRoute.queryParams.subscribe(params => {
    const query = params['q'];
    const type = params['type'] || 'multi'; // default to 'multi'

    if (!query) return;

    this.Spinner.show();

    this._DataService.searchByType(query, type).subscribe((res) => {
      if (type === 'person') {
        // Go directly to person-details if 1 match found
        const person = res.results?.[0];
        if (person && person.id) {
          this._Router.navigate(['/person', person.id]);
        } else {
          this._Router.navigate(['/notfound']);
        }
        return;
      }

      this.allData = res.results || [];
      this.filterData();

      this.found = this.allData.length > 0;
      if (!this.found) this._Router.navigate(['/notfound']);

      this.Spinner.hide();
    }, err => {
      this.Spinner.hide();
      this._Router.navigate(['/notfound']);
    });
  });
}

  searchAll(query: string): void {
    this.Spinner.show();

    this._DataService.search(query).subscribe((response) => {
      this.allData = response.results || [];
      this.filterData();

      this.handleResult();
    }, () => this.handleError());
  }

  searchByType(query: string, type: string): void {
    this.Spinner.show();

    this._DataService.searchMulti(query, type).subscribe((res: any) => {
      this.allData = res.results || [];

      if (type === 'person') {
        this.allData = this.allData.slice(0, 12); // just top celebs
      } else {
        this.filterData();
      }

      this.handleResult();
    }, () => this.handleError());
  }

filterData() {
  this.allData = this.allData.filter((item: MediaItem) =>
    ['movie', 'tv', 'person'].includes(item.media_type) &&
    item.poster_path != null
  ).slice(0, 12);
}


  handleResult(): void {
    this.Spinner.hide();

    if (this.allData.length > 0) {
      this.found = true;
    } else {
      this.found = false;
      this._Router.navigate(['/notfound']);
    }
  }

  handleError(): void {
    this.Spinner.hide();
    this._Router.navigate(['/notfound']);
  }
}

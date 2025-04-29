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

  target: string = "";
  allData: MediaItem[] = [];
  found: boolean = true;
  
  constructor(
    private _DataService: DataService,
    private _ActivatedRoute: ActivatedRoute,
    private Spinner: NgxSpinnerService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe(() => {
      this.target = this._ActivatedRoute.snapshot.paramMap.get("target") || "";

      this.Spinner.show();

      this._DataService.search(this.target).subscribe((response) => {
        this.allData = response.results || [];

        // Call the filterData method to filter the results
        this.filterData();

        if (this.allData.length > 0) {
          this.found = true;
        } else {
          this.found = false;
          this._Router.navigate(['/notfound']);
        }

        this.Spinner.hide();
      }, (error) => {
        // Handle error if API fails
        this.Spinner.hide();
        this._Router.navigate(['/notfound']);
      });
    });
  }

  // Define the filterData method outside of the subscribe block
  filterData() {
    this.allData = this.allData.filter((item: MediaItem) => 
      (item.media_type === 'movie' || item.media_type === 'tv') && 
      item.poster_path != null
    ).slice(0, 12);
  }
}


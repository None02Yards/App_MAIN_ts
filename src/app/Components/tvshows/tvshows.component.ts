
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as AOS from 'aos';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-tvshows',
  templateUrl: './tvshows.component.html',
  styleUrls: ['./tvshows.component.scss']
})
export class TVShowsComponent implements OnInit {

  notice: boolean = true;
  disablePrev: boolean = false;
  disableNext: boolean = true;
  page: number = 1;
  type: any = "";
  allData: any[] = [];
  tvShows: any[] = [];
  watchlist: number[] = [];

  constructor(
    private _DataService: DataService,
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private Spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  
    this._ActivatedRoute.paramMap.subscribe(params => {
      this.type = params.get("genre");
      this.page = Number(params.get("page")) || 1;
      this.disablePrev = this.page > 1;
      this.loadData();
    });

    const savedList = localStorage.getItem('watchlist');
    if (savedList) {
    this.watchlist = JSON.parse(savedList);
  }

  }

  trackById(index: number, item: any): number {
    return item.id;
  }
  
  
  isInWatchlist(id: number): boolean {
    return this.watchlist.includes(id);
  }

  toggleWatchlist(id: number) {
    const index = this.watchlist.indexOf(id);
    if (index > -1) {
      this.watchlist.splice(index, 1);
    } else {
      this.watchlist.push(id);
    }
  
    // Optional: Save to localStorage for persistence
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
  }
  


  loadData() {
    this.Spinner.show();
    this._DataService.getData("tv", this.type, this.page).subscribe(response => {
      this.notice = response.success;
      this.Spinner.hide();
      this.allData = response.results.filter((item: any) => item.poster_path != null);
      this.tvShows = this.allData.slice(0, 12); // or full list
      setTimeout(() => AOS.refresh(), 0);
    });
  }
  
  Next() {
    if (this.page < 1000) {
      this.page++;
      this._Router.navigate(['/tvshows', this.type, this.page]);
    }
  }
  
  
  Prev() {
    if (this.page > 1) {
      this.page--;
      this._Router.navigate(['/tvshows', this.type, this.page]);
    }
  }

}

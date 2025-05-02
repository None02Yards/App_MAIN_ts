

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  type: string = '';
  pageTitle: string = '';
  page: number = 1;
  Movies: any[] = [];
  displayedMovies: any[] = [];
  watchlist: number[] = [];

  disablePrev = true;
  disableNext = false;
  notice = true;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {

    const storedWatchlist = localStorage.getItem('watchlist');
  this.watchlist = storedWatchlist ? JSON.parse(storedWatchlist) : [];
    this.route.params.subscribe(() => {
      this.type = this.route.snapshot.paramMap.get('genre') || '';
      this.page = Number(this.route.snapshot.paramMap.get('page')) || 1;
      

      switch (this.type) {
        case 'now_playing':
          this.pageTitle = 'Now Playing';
          break;
        case 'popular':
          this.pageTitle = 'Popular Movies';
          break;
        case 'top_rated':
          this.pageTitle = 'Top Rated Movies';
          break;
        case 'upcoming':
          this.pageTitle = 'Upcoming Movies';
          break;
        default:
          this.pageTitle = 'Movies';
      }

      this.fetchMovies();
    });
  }

  toggleWatchlist(movieId: number): void {
    const index = this.watchlist.indexOf(movieId);
  
    if (index !== -1) {
      this.watchlist.splice(index, 1); // Remove
    } else {
      this.watchlist.push(movieId); // Add
    }
  
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist)); // Save updated list
  }
  
  isInWatchlist(movieId: number): boolean {
    return this.watchlist.includes(movieId);
  }
  


  fetchMovies(): void {
    this.spinner.show();
  
    this.dataService.getData('movie', this.type, this.page).subscribe(response => {
      this.spinner.hide();
  
      this.notice = response.success;
      this.Movies = (response.results || []).filter((item: any) => item.poster_path);
  
      // Update displayedMovies AFTER getting real movies
      this.displayedMovies = this.Movies.slice(0, 12);
  
      // Then call updatePaginationButtons (AFTER updating displayedMovies)
      this.updatePaginationButtons();
    });
  }
  

  updatePaginationButtons(): void {
    this.disablePrev = this.page <= 1;
    this.disableNext = this.Movies.length === 0 || this.Movies.length < 12;
  }
  

  Next(): void {
    if (this.disableNext) {
      return;
    }
    this.page++;
    this.fetchMovies();
  }
  
  Prev(): void {
    if (this.disablePrev) {
      return;
    }
    this.page--;
    this.fetchMovies();
  }
  
  
}



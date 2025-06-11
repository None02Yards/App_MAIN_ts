

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';
import { WatchlistService } from 'src/app/Services/watchlist.service';

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

  disablePrev = true;
  disableNext = false;
  notice = true;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private watchlistService: WatchlistService // ✅ Injected
  ) {}

  ngOnInit(): void {
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

  // ✅ Handles pagination
  Next(): void {
    if (!this.disableNext) {
      this.page++;
      this.fetchMovies();
    }
  }

  Prev(): void {
    if (!this.disablePrev) {
      this.page--;
      this.fetchMovies();
    }
  }

  // ✅ Used for ngFor trackBy
  trackById(index: number, item: any): number {
    return item.id;
  }

  // ✅ Core data fetcher
  fetchMovies(): void {
    this.spinner.show();

    this.dataService.getData('movie', this.type, this.page).subscribe(response => {
      this.spinner.hide();

      this.notice = response.success;
      this.Movies = (response.results || []).filter((item: any) => item.poster_path);
      this.displayedMovies = this.Movies.slice(0, 12);
      this.updatePaginationButtons();
    });
  }

  // ✅ Controls pagination buttons
  updatePaginationButtons(): void {
    this.disablePrev = this.page <= 1;
    this.disableNext = this.Movies.length === 0 || this.Movies.length < 12;
  }

  // ✅ Check if movie is in watchlist using the service
  isInWatchlist(movieId: number): boolean {
    return this.watchlistService.isInWatchlist(movieId, 'movie');
  }

  // ✅ Toggle using service
  toggleWatchlist(movie: any): void {
    const isSaved = this.watchlistService.isInWatchlist(movie.id, 'movie');

    if (isSaved) {
      this.watchlistService.removeFromWatchlist(movie.id, 'movie');
    } else {
      this.watchlistService.addToWatchlist({ id: movie.id, type: 'movie' });
    }
  }
}

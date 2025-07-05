import { Component, OnInit } from '@angular/core';
import { WatchlistService, WatchlistItem } from 'src/app/Services/watchlist.service';
import { DataService } from 'src/app/Services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-movies-watchlist',
  templateUrl: './movies-watchlist.component.html',
  styleUrls: ['./movies-watchlist.component.scss']
})
export class MoviesWatchlistComponent implements OnInit {
  movies: WatchlistItem[] = [];
  pageTitle = 'Movies Watchlist';
  dropdownVisibleForId: number | null = null;

  constructor(
    private watchlistService: WatchlistService,
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.movies = [];

    const saved = this.watchlistService.getByType('movie');
    for (const item of saved) {
      this.dataService.getDetails('movie', item.id).subscribe(data => {
        const mapped: WatchlistItem = {
          id: item.id,
          type: item.type,
          title: data.title || data.name,
          poster_path: data.poster_path
        };
        this.movies = [...this.movies, mapped]; // Triggers Input change detection
      });
    }
  }

  handleRemove(id: number): void {
    this.watchlistService.removeFromWatchlist(id, 'movie');
    this.movies = this.movies.filter(movie => movie.id !== id);
  }

  toggleGeneralWatchlist(item: WatchlistItem): void {
    if (this.watchlistService.isInWatchlist(item.id, 'movie')) {
      this.watchlistService.removeFromWatchlist(item.id, 'movie');
      this.movies = this.movies.filter(m => m.id !== item.id);
      this.toastr.info('Removed from general watchlist');
    } else {
      this.watchlistService.addToWatchlist({ id: item.id, type: 'movie' });
      // Optionally fetch and push new details to the movies array for instant UI update
      this.dataService.getDetails('movie', item.id).subscribe(data => {
        const mapped: WatchlistItem = {
          id: item.id,
          type: item.type,
          title: data.title || data.name,
          poster_path: data.poster_path
        };
        this.movies.push(mapped);
      });
      this.toastr.success('Added to general watchlist');
    }
    this.dropdownVisibleForId = null;
  }
}

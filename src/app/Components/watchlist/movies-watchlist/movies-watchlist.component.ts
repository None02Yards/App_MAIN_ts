import { Component, OnInit } from '@angular/core';
import { WatchlistService, WatchlistItem } from 'src/app/Services/watchlist.service';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-movies-watchlist',
  templateUrl: './movies-watchlist.component.html',
  styleUrls: ['./movies-watchlist.component.scss']
})
export class MoviesWatchlistComponent implements OnInit {
  movies: WatchlistItem[] = [];
  pageTitle = 'Movies Watchlist';

  constructor(
    private watchlistService: WatchlistService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const saved = this.watchlistService.getByType('movie');

    for (const item of saved) {
      this.dataService.getDetails('movie', item.id).subscribe(data => {
        const mapped: WatchlistItem = {
          id: item.id,
          type: item.type,
          title: data.title || data.name,
          poster_path: data.poster_path
        };
        this.movies.push(mapped);
      });
    }
  }

  handleRemove(id: number): void {
    this.watchlistService.removeFromWatchlist(id, 'movie');
    this.movies = this.movies.filter(movie => movie.id !== id);
  }
}

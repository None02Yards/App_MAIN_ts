import { Component, OnInit } from '@angular/core';
import { WatchlistService, WatchlistItem } from 'src/app/Services/watchlist.service';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-tv-watchlist',
  templateUrl: './tv-watchlist.component.html',
  styleUrls: ['./tv-watchlist.component.scss']
})
export class TvWatchlistComponent implements OnInit {
  tvShows: WatchlistItem[] = [];
  pageTitle = 'TV Shows Watchlist';

  constructor(
    private watchlistService: WatchlistService,
    private dataService: DataService
  ) {}

ngOnInit(): void {
  const saved = this.watchlistService.getByType('tv');
  console.log('TV Watchlist raw:', saved); // 🔍 Must show { id, type }

  if (saved.length === 0) {
    console.warn('No TV shows found in watchlist.');
  }

  saved.forEach((item) => {
    this.dataService.getDetails('tv', item.id).subscribe((data) => {
      const mapped: WatchlistItem = {
        id: item.id,
        type: item.type,
        title: data.title || data.name,
        poster_path: data.poster_path
      };
      this.tvShows = [...this.tvShows, mapped];
    });
  });
}

  handleRemove(id: number): void {
    this.watchlistService.removeFromWatchlist(id, 'tv');
    this.tvShows = this.tvShows.filter(show => show.id !== id);
  }
}

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { WatchlistService, WatchlistItem } from 'src/app/Services/watchlist.service';

@Component({
  selector: 'app-anime-watchlist',
  templateUrl: './anime-watchlist.component.html',
  styleUrls: ['./anime-watchlist.component.scss']
})
export class AnimeWatchlistComponent implements OnInit {
  animeList: WatchlistItem[] = [];

  constructor(
    private dataService: DataService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    const items = this.watchlistService.getByType('anime');

    items.forEach(item => {
      this.dataService.getDetails('anime', item.id).subscribe(data => {
        if (data) {
          this.animeList.push({
            id: item.id,
            type: 'anime',
            title: data.title || data.name,
            poster_path: data.poster_path
          });
        }
      });
    });
  }

 removeFromWatchlist(id: number): void {
  this.watchlistService.removeFromWatchlist(id, 'anime');
  this.animeList = this.animeList.filter(item => item.id !== id);
}

}

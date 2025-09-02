import { Component, OnInit } from '@angular/core';
import { of, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray } from 'rxjs/operators';

import { DataService } from 'src/app/Services/data.service';
import { WatchlistService, WatchlistItem } from 'src/app/Services/watchlist.service';

type Media = 'movie' | 'tv';

@Component({
  selector: 'app-anime-watchlist',
  templateUrl: './anime-watchlist.component.html',
  styleUrls: ['./anime-watchlist.component.scss']
})
export class AnimeWatchlistComponent implements OnInit {
  animeList: WatchlistItem[] = [];
  loading = true;

  constructor(
    private dataService: DataService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    const stored = this.watchlistService.getByType('anime') || [];

    if (!stored.length) {
      this.loading = false;
      return;
    }

    forkJoin(
      stored.map((it: any) => this.resolveDetails(it))
    )
    .pipe(
      map(arr => arr.filter(Boolean) as WatchlistItem[])
    )
    .subscribe({
      next: (items) => {
         this.animeList = items;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  
  private resolveDetails(it: any) {
    const id = it?.id;
    if (!id) return of(null);

    
    const hinted: Media | undefined = (it.originType || it.media) as Media | undefined;

    if (hinted === 'tv' || hinted === 'movie') {
      return this.dataService.getDetails(hinted, id).pipe(
        map((data: any) => this.toWatchlistItem(id, data)),
        catchError(() => of(null))
      );
    }

    return this.dataService.getDetails('tv', id).pipe(
      map((data: any) => this.toWatchlistItem(id, data, 'tv')),
      catchError(() =>
        this.dataService.getDetails('movie', id).pipe(
          map((data: any) => this.toWatchlistItem(id, data, 'movie')),
          catchError(() => of(null))
        )
      )
    );
  }

  private toWatchlistItem(id: number, data: any, mediaGuess?: Media): WatchlistItem | null {
    if (!data) return null;
    const title = data.title || data.name || 'Untitled';
    const poster_path = data.poster_path || '';
    const item: WatchlistItem = {
      id,
      type: 'anime',
      title,
      poster_path,
      // @ts-ignore
      originType: mediaGuess || (data.title ? 'movie' : 'tv')
    };
    return item;
  }

  removeFromWatchlist(id: number): void {
    this.watchlistService.removeFromWatchlist(id, 'anime');
    this.animeList = this.animeList.filter(i => i.id !== id);
  }
}

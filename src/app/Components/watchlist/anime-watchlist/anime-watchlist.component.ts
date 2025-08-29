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

    // Nothing saved? Just stop loading.
    if (!stored.length) {
      this.loading = false;
      return;
    }

    // Resolve each stored id to real TMDB details.
    // Prefer an explicit origin/media field if your service stores it.
    forkJoin(
      stored.map((it: any) => this.resolveDetails(it))
    )
    .pipe(
      // filter out failures
      map(arr => arr.filter(Boolean) as WatchlistItem[])
    )
    .subscribe({
      next: (items) => {
        // optionally sort newest first or by title
        this.animeList = items;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  /** Try to resolve details for a saved "anime" item.
   *  If we have origin/media use it; else try TV then Movie. */
  private resolveDetails(it: any) {
    const id = it?.id;
    if (!id) return of(null);

    // If your WatchlistService stored the original media (e.g. originType/media),
    // use it directly for a single call.
    const hinted: Media | undefined = (it.originType || it.media) as Media | undefined;

    if (hinted === 'tv' || hinted === 'movie') {
      return this.dataService.getDetails(hinted, id).pipe(
        map((data: any) => this.toWatchlistItem(id, data)),
        catchError(() => of(null))
      );
    }

    // Fallback: try TV first, then Movie.
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

  /** Normalize TMDB payload into our WatchlistItem */
  private toWatchlistItem(id: number, data: any, mediaGuess?: Media): WatchlistItem | null {
    if (!data) return null;
    const title = data.title || data.name || 'Untitled';
    const poster_path = data.poster_path || '';
    // Keep type = 'anime' for this tab; optionally carry origin media if useful elsewhere
    const item: WatchlistItem = {
      id,
      type: 'anime',
      title,
      poster_path,
      // @ts-ignore optionally keep the origin media (helps future fetches)
      originType: mediaGuess || (data.title ? 'movie' : 'tv')
    };
    return item;
  }

  removeFromWatchlist(id: number): void {
    this.watchlistService.removeFromWatchlist(id, 'anime');
    this.animeList = this.animeList.filter(i => i.id !== id);
  }
}

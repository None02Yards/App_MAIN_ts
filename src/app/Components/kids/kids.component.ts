

// src/app/Components/kids/kids.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { KidsDataService } from 'src/app/Services/kids-data.service';
import { WatchlistService, CustomList } from 'src/app/Services/watchlist.service';
// import { WatchlistMenuService } from 'src/app/Services/watchlist-menu.service';

@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.scss'],
  // 👇 Scopes the watchlist menu bus to the Kids page only
  // providers: [WatchlistMenuService]
})
export class KidsComponent implements OnInit, OnDestroy {
  kidsSlider: any[] = [];
  customLists: CustomList[] = [];

  kidsTrending: any[] = [];
  kidsTrendingMovies: any[] = [];
  kidsTrendingTV: any[] = [];
  topTenKids: any[] = [];
  kidsMoreToExplore: any[] = [];
  kidsTrailers: any[] = [];
  kidsExclusiveVideos: any[] = [];

  kidsQuotes: string[] = [
    'For every child, there’s a story waiting to be told.',
    'Imagination is the key to discovery.',
    'Adventure begins with a smile.',
    'Every day is a chance to learn something magical.',
    'Dream big, little one!'
  ];

  kidsQuoteGradients: string[] = [
    'linear-gradient(90deg, #ffb347, #ffcc33)',
    'linear-gradient(90deg, #87ceeb, #a3e635)',
    'linear-gradient(90deg, #fb7185, #facc15)',
    'linear-gradient(90deg, #a18cd1, #fbc2eb)',
    'linear-gradient(90deg, #fbc2eb, #a6c1ee)'
  ];
  kidsQuote = '';

  private quoteTimer?: any;
  private sub?: Subscription;

  constructor(
    private kidsData: KidsDataService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    // rotate headline quote
    this.kidsQuote = this.getRandomQuote();
    this.quoteTimer = setInterval(() => {
      this.kidsQuote = this.getRandomQuote();
    }, 10000);

    this.kidsData.getKidsSliderMovies()
      .pipe(delay(2000))
      .subscribe((res: any) => {
        this.kidsSlider = res?.results ?? [];
      });

    this.sub = forkJoin({
      trending: this.kidsData.getKidsTrending(),
      movies:   this.kidsData.getKidsMovies(),
      tv:       this.kidsData.getKidsTVShows(),
      explore:  this.kidsData.getMoreToExploreForKids(),
      exclusives: this.kidsData.getKidsExclusiveVideos()
    }).subscribe(({ trending, movies, tv, explore, exclusives }: any) => {
      this.kidsTrending       = trending?.results ?? [];
      this.kidsTrendingMovies = (movies?.results ?? []).slice(0, 10);
      this.kidsTrendingTV     = (tv?.results ?? []).slice(0, 10);
      this.topTenKids         = this.kidsTrendingTV;
      this.kidsMoreToExplore  = explore ?? [];
      this.kidsExclusiveVideos = exclusives ?? [];

      // sync custom lists once
      this.customLists = this.watchlistService.getCustomLists();

      // trailers for the first kids movie
      const firstMovieId = this.kidsTrendingMovies[0]?.id;
      if (firstMovieId) {
        this.kidsData.getKidsVideos(firstMovieId).subscribe((trailers: any) => {
          const results = trailers?.results ?? [];
          this.kidsTrailers = results.map((v: any) => ({
            title: v.name,
            videoUrl: `https://www.youtube.com/watch?v=${v.key}`,
            imageUrl: 'https://via.placeholder.com/500',
            key: v.key
          }));
        });
      }

      // ✅ if you want to pre-fill an "anime" watchlist item, use a TV id (not movie)
      const firstAnime = this.kidsTrendingTV[0];
      if (firstAnime?.id) {
        this.watchlistService.addToWatchlist({
          id: firstAnime.id,
          type: 'anime',
          addedAt: new Date().toISOString()
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.quoteTimer) clearInterval(this.quoteTimer);
    this.sub?.unsubscribe();
  }

  private getRandomQuote(): string {
    const i = Math.floor(Math.random() * this.kidsQuotes.length);
    return this.kidsQuotes[i];
  }

  // Optional: provide a handler you can pass into Home if you choose to use it.
  goToPopularTVShows = () => {
    // e.g., navigate to /tvshows/popular/1 if you wire Router
  };
}


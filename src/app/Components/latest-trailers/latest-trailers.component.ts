

import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { KidsDataService } from 'src/app/Services/kids-data.service';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
}

@Component({
  selector: 'app-latest-trailers',
  templateUrl: './latest-trailers.component.html',
  styleUrls: ['./latest-trailers.component.scss']
})
export class LatestTrailersComponent implements OnInit {
  @Input() isKids = false;

  trailerTabs = [
    { label: 'Popular', key: 'popular' },
    { label: 'Streaming', key: 'streaming' },
    { label: 'On TV', key: 'on_tv' },
    { label: 'For Rent', key: 'for_rent' },
    { label: 'In Theaters', key: 'in_theaters' }
  ];

  selectedTab = 'popular';
  latestTrailers: any[] = [];

  constructor(
    private _dataService: DataService,
    private kidsData: KidsDataService
  ) {}

  ngOnInit(): void {
    this.fetchLatestTrailers(this.selectedTab);
  }

  async fetchLatestTrailers(tabKey: string) {
    this.selectedTab = tabKey;
    const trailerList: any[] = [];

    if (this.isKids) {
      const data = await this.kidsData.getKidsMovies().toPromise();
      const shuffled: MediaItem[] = this.shuffleArray(data.results as MediaItem[]).slice(0, 10);

      for (const item of shuffled) {
        const trailers = await this.kidsData.getKidsVideos(item.id).toPromise();
        const key = trailers.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key;

        if (key) {
          trailerList.push({
            title: item.title || item.name,
            thumbnail: `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`,
            videoUrl: `https://www.youtube.com/watch?v=${key}`
          });
        }

        if (trailerList.length >= 4) break;
      }

    } else if (tabKey === 'in_theaters') {
      const [moviesResult, showsResult] = await Promise.all([
        this._dataService.getTrailerCategory('in_theaters').toPromise(),
        this._dataService.getData('tv', 'airing_today', 1).toPromise()
      ]);

      const combined: MediaItem[] = [...(moviesResult?.results || []), ...(showsResult?.results || [])] as MediaItem[];
      const shuffled: MediaItem[] = this.shuffleArray(combined).slice(0, 10);

      for (const item of shuffled) {
        const isTV = item.name && !item.title;
        const trailerKey = await this._dataService.getYoutubeTrailerKey(item.id, this._dataService.APIKey, isTV ? 'tv' : 'movie');

        if (trailerKey) {
          trailerList.push({
            title: item.title || item.name,
            thumbnail: `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`,
            videoUrl: `https://www.youtube.com/watch?v=${trailerKey}`
          });
        }

        if (trailerList.length >= 4) break;
      }

    } else {
      const isTV = tabKey === 'on_tv';
      const data = await this._dataService.getTrailerCategory(tabKey).toPromise();
      const shuffled: MediaItem[] = this.shuffleArray(data.results as MediaItem[]).slice(0, 10);

      for (const item of shuffled) {
        const trailerKey = await this._dataService.getYoutubeTrailerKey(item.id, this._dataService.APIKey, isTV ? 'tv' : 'movie');

        if (trailerKey) {
          trailerList.push({
            title: item.title || item.name,
            thumbnail: `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`,
            videoUrl: `https://www.youtube.com/watch?v=${trailerKey}`
          });
        }

        if (trailerList.length >= 4) break;
      }
    }

    this.latestTrailers = trailerList;
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}

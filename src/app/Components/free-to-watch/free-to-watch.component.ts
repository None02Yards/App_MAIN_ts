import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-free-to-watch',
  templateUrl: './free-to-watch.component.html',
  styleUrls: ['./free-to-watch.component.scss']
})
export class FreeToWatchComponent implements OnInit {
  freeTab: 'movie' | 'tv' = 'movie';
  freeMovies: any[] = [];
  freeTV: any[] = [];

  constructor(private _DataService: DataService) {}

  ngOnInit(): void {
    this.fetchFreeToWatchMovies();
    this.fetchFreeToWatchTV();
  }

  fetchFreeToWatchMovies(): void {
    const url = `${this._DataService.MovieAPI}/discover/movie?api_key=${this._DataService.APIKey}&with_watch_monetization_types=free&sort_by=popularity.desc`;
    this._DataService.fetchFromApi(url).subscribe({
      next: (res) => {
        this.freeMovies = res.results.filter((m: any) => m.poster_path);
      },
      error: (err) => console.error('Free Movies Error:', err)
    });
  }

  fetchFreeToWatchTV(): void {
    const url = `${this._DataService.MovieAPI}/discover/tv?api_key=${this._DataService.APIKey}&with_watch_monetization_types=free&sort_by=popularity.desc`;
    this._DataService.fetchFromApi(url).subscribe({
      next: (res) => {
        this.freeTV = res.results.filter((m: any) => m.poster_path);
      },
      error: (err) => console.error('Free TV Error:', err)
    });
  }
}


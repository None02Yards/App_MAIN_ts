

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { WatchlistService } from 'src/app/Services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {

  movies: any[] = [];
  tvShows: any[] = [];
  customLists: string[] = [];
  selectedCustomList: string = ''; // Track the selected custom list
  newListName: string = ''; // Name for the new list
  isCreateListModalOpen: boolean = false; // Control modal visibility




  constructor(
    private _DataService: DataService,
    private _WatchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    const savedList = this._WatchlistService.getWatchlist();
    
    // We need to add a way to differentiate if it's a movie or TV show in the saved data.
    savedList.forEach((id: number) => {
      // Assuming we can check whether the id belongs to a movie or TV show by some means, for example:
      this._DataService.getDetails('movie', id).subscribe(movieData => {
        if (movieData) {
          this.movies.push(movieData); // If it's a movie, push to movies array
        }
      });
  
      this._DataService.getDetails('tv', id).subscribe(tvData => {
        if (tvData) {
          this.tvShows.push(tvData); // If it's a TV show, push to tvShows array
        }
      });
    });
  }
  

  removeFromWatchlist(id: number): void {
    this._WatchlistService.removeFromWatchlist(id);
    this.movies = this.movies.filter(item => item.id !== id);
    this.tvShows = this.tvShows.filter(item => item.id !== id);
  }

  openCreateListModal() {
    this.isCreateListModalOpen = true;
  }
  
}

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-watchlist',
//   templateUrl: './watchlist.component.html',
//   styleUrls: ['./watchlist.component.scss']
// })
// export class WatchlistComponent implements OnInit {
//   type: string = 'movies';

//   constructor(private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       this.type = params.get('type') || 'movies';
//     });
//   }

//   openCreateListModal() {
//     this.isCreateListModalOpen = true;
//   }
// }

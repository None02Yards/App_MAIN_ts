// import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/Services/data.service';

// @Component({
//   selector: 'app-watchlist',
//   templateUrl: './watchlist.component.html',
//   styleUrls: ['./watchlist.component.scss']
// })
// export class WatchlistComponent implements OnInit {

//   watchlistDetails: any[] = [];
//   sortBy: string = 'title'; // Default sort criteria, can be 'title', 'release_date', 'rating'

//   constructor(private _DataService: DataService) {}

//   ngOnInit(): void {
//     const savedList = localStorage.getItem('watchlist');
//     const ids = savedList ? JSON.parse(savedList) : [];

//     // Fetch full details for each ID
//     ids.forEach((id: number) => {
//       this._DataService.getDetails('tv', id).subscribe(data => {
//         this.watchlistDetails.push(data);
//       });

//       this._DataService.getDetails('movie', id).subscribe(data => {
//         this.watchlistDetails.push(data);
//       });
//     });
//   }

//   // Sort function based on chosen criteria
//   sortWatchlist(): void {
//     if (this.sortBy === 'title') {
//       this.watchlistDetails.sort((a, b) => a.title.localeCompare(b.title));
//     } else if (this.sortBy === 'release_date') {
//       this.watchlistDetails.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
//     } else if (this.sortBy === 'rating') {
//       this.watchlistDetails.sort((a, b) => b.vote_average - a.vote_average); // assuming 'vote_average' is the rating
//     }
//   }

//   // Update sorting criteria and apply sorting
//   onSortChange(event: any): void {
//     this.sortBy = event.target.value;
//     this.sortWatchlist();
//   }

//   removeFromWatchlist(id: number): void {
//     // Remove from local array
//     this.watchlistDetails = this.watchlistDetails.filter(item => item.id !== id);
    
//     // Remove from localStorage
//     const savedList = localStorage.getItem('watchlist');
//     let ids = savedList ? JSON.parse(savedList) : [];
  
//     ids = ids.filter((item: any) => item !== id); // if your list is plain numbers
//     // ids = ids.filter((item: any) => item.id !== id); // if your list is { id, type }
    
//     localStorage.setItem('watchlist', JSON.stringify(ids));
//   }
  
// }

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


// // movies-watchlist.ts
// import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/Services/data.service';
// import { WatchlistService } from 'src/app/Services/watchlist.service';

// @Component({
//   selector: 'app-movies-watchlist',
//   templateUrl: './movies-watchlist.component.html',
//   styleUrls: ['./movies-watchlist.component.scss']
// })
// export class MoviesWatchlistComponent implements OnInit {
//   movies: any[] = [];

//   constructor(
//     private dataService: DataService,
//     private watchlistService: WatchlistService
//   ) {}

//   ngOnInit(): void {
//     const ids = this.watchlistService.getWatchlist();

//     ids.forEach((id: number) => {
//       this.dataService.getDetails('movie', id).subscribe(data => {
//         if (data) this.movies.push(data);
//       });
//     });
//   }

//   removeFromWatchlist(id: number) {
//     this.watchlistService.removeItem(id, 'movie').subscribe(() => {
//       this.movies = this.movies.filter(item => item.id !== id);
//     });
//   }
  
// }

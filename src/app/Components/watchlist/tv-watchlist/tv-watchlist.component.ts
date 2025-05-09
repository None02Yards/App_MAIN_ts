// import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/Services/data.service';
// import { WatchlistService } from 'src/app/Services/watchlist.service';

// @Component({
//   selector: 'app-tv-watchlist',
//   templateUrl: './tv-watchlist.component.html',
//   styleUrls: ['./tv-watchlist.component.scss']
// })
// export class TvWatchlistComponent implements OnInit {
//   tvShows: any[] = [];

//   constructor(
//     private dataService: DataService,
//     private watchlistService: WatchlistService
//   ) {}

//   ngOnInit(): void {
//     const ids = this.watchlistService.getWatchlist();

//     ids.forEach((id: number) => {
//       this.dataService.getDetails('tv', id).subscribe(data => {
//         if (data) this.tvShows.push(data);
//       });
//     });
//   }

//   removeFromWatchlist(id: number) {
//     this.watchlistService.removeFromWatchlist(id, 'tv').subscribe(() => {
//       this.tvShows = this.tvShows.filter(item => item.id !== id);
//     });
//   }
// }

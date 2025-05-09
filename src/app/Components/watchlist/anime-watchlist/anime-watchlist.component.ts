// import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/Services/data.service';
// import { WatchlistService } from 'src/app/Services/watchlist.service';

// @Component({
//   selector: 'app-anime-watchlist',
//   templateUrl: './anime-watchlist.component.html',
//   styleUrls: ['./anime-watchlist.component.scss']
// })
// export class AnimeWatchlistComponent implements OnInit {
//   animeList: any[] = [];

//   constructor(
//     private dataService: DataService,
//     private watchlistService: WatchlistService
//   ) {}

//   ngOnInit(): void {
//     const ids = this.watchlistService.getWatchlist();

//     ids.forEach((id: number) => {
//       this.dataService.getDetails('anime', id).subscribe(data => {
//         if (data) this.animeList.push(data);
//       });
//     });
//   }

//   removeFromWatchlist(id: number) {
//     this.watchlistService.removeItem(id, 'anime').subscribe(() => {
//       this.animeList = this.animeList.filter(item => item.id !== id);
//     });
//   }
// }

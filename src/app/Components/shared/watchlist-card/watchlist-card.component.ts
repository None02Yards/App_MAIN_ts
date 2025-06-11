// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { WatchlistItem } from 'src/app/Services/watchlist.service'; // adjust path as needed

// @Component({
//   selector: 'app-watchlist-card',
//   templateUrl: './watchlist-card.component.html',
//   styleUrls: ['./watchlist-card.component.scss']
// })
// export class WatchlistCardComponent {
//   @Input() item!: WatchlistItem;
//   @Input() items: any[] = [];
//   @Input() routerLinkPath: string = '';
//   @Output() remove = new EventEmitter<number>();

//   onRemoveClick(id: number) {
//     this.remove.emit(id);
//   }
// }


//Shared dir
// watchlist-card// watchlist-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-watchlist-card',
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.scss']
})
export class WatchlistCardComponent {
  @Input() items: any[] = [];
  @Input() mediaType: 'movie' | 'tv' = 'movie'; // for routerLink
  @Output() remove = new EventEmitter<number>();

  onRemoveClick(id: number) {
    this.remove.emit(id);
  }
}

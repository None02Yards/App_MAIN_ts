// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-watchlist-card',
//   templateUrl: './watchlist-card.component.html',
//   styleUrls: ['./watchlist-card.component.scss']
// })
// export class WatchlistCardComponent {
//   @Input() item: any;
//   @Input() type: string = 'movie'; // default fallback
//   @Output() remove = new EventEmitter<number>();

//   get routerLinkPath(): string {
//     return `/details/${this.type}/${this.item.id}`;
//   }

//   onRemove() {
//     this.remove.emit(this.item.id);
//   }
// }




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
  @Input() mediaType: 'movie' | 'tv' = 'movie'; 
  @Output() remove = new EventEmitter<number>();

  onRemoveClick(id: number) {
    this.remove.emit(id);
  }
}

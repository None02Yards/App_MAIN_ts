import { Component, Input, Output, EventEmitter, HostListener  } from '@angular/core';

@Component({
  selector: 'app-watchlist-card',
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.scss']
})
export class WatchlistCardComponent {
  @Input() items: any[] = [];
  @Input() mediaType: 'movie' | 'tv' = 'movie'; 
  @Output() remove = new EventEmitter<number>();

  // confirmation & feedback state
  showConfirm = false;
  pendingId: number | null = null;
  showRemovedMessage = false;

  onRemoveClick(id: number) {
    this.pendingId = id;
    this.showConfirm = true;
  }

  confirmRemove() {
    if (this.pendingId != null) {
      this.remove.emit(this.pendingId);
      this.showConfirm = false;
      this.showRemovedMessage = true;
      // hide after 1.5s
      setTimeout(() => this.showRemovedMessage = false, 4000);
    }
  }

  cancelRemove() {
    this.showConfirm = false;
    this.pendingId = null;
  }

   // <-- new HostListener
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.showConfirm) {
      this.cancelRemove();
    }
  }
}

// E:\Angular-Movies\MAIN-CineWorld-App\MAIN-CineWorld-App\src\app\Components\shared\watchlist-card
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-watchlist-card',
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.scss']
})
export class WatchlistCardComponent implements OnChanges {
  @Input() items: any[] = [];
@Input() mediaType: 'movie' | 'tv' | 'anime' = 'movie';
  @Output() remove = new EventEmitter<number>();

  showConfirm = false;
  pendingId: number | null = null;
  showRemovedMessage = false;

  // pagination
  page = 1;
  itemsPerPage = 8;
  paginatedItems: any[] = [];
  disablePrev = true;
  disableNext = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items?.length) {
      this.page = 1;
      this.updatePaginatedItems();
    }
  }

  updatePaginatedItems(): void {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedItems = this.items.slice(start, end);
    this.updatePaginationButtons();
  }

  updatePaginationButtons(): void {
    this.disablePrev = this.page <= 1;
    this.disableNext = (this.page * this.itemsPerPage) >= this.items.length;
  }

  Next(): void {
    if (!this.disableNext) {
      this.page++;
      this.updatePaginatedItems();
    }
  }

  Prev(): void {
    if (!this.disablePrev) {
      this.page--;
      this.updatePaginatedItems();
    }
  }

  onRemoveClick(id: number): void {
    this.pendingId = id;
    this.showConfirm = true;
  }

  confirmRemove(): void {
    if (this.pendingId != null) {
      this.remove.emit(this.pendingId);
      this.showConfirm = false;
      this.showRemovedMessage = true;
      this.pendingId = null;

      setTimeout(() => {
        this.showRemovedMessage = false;
        this.updatePaginatedItems(); // re-sync after removal
      }, 4000);
    }
  }

  cancelRemove(): void {
    this.showConfirm = false;
    this.pendingId = null;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.showConfirm) {
      this.cancelRemove();
    }
  }
}


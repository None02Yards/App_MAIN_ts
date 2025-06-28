import { Injectable } from '@angular/core';
import { WatchlistService } from './watchlist.service';

export interface CustomListItem {
  id: number | string;
  title: string;
  poster_path: string;
  [key: string]: any; // optional fallback
}
@Injectable({
  providedIn: 'root'
})

export class BookmarkService {
  constructor(private watchlistService: WatchlistService) {}

  getCustomLists() {
    return this.watchlistService.getCustomLists();
  }

  addToCustomList(listId: string, item: any) {
    const allLists = this.watchlistService.getCustomLists();
    const target = allLists.find(list => list.id === listId);
    if (target && !target.items.some((i: CustomListItem) => i.id === item.id)) {
      target.items.push(item);
      localStorage.setItem('customLists', JSON.stringify(allLists));
    }
  }

  openListChooser(item: any, showModal: (lists: any[], onSelect: (id: string) => void) => void) {
    const lists = this.getCustomLists();
    if (lists.length === 0) {
      alert('⚠️ You must create a list first!');
    } else {
      showModal(lists, (selectedId) => {
        this.addToCustomList(selectedId, item);
      });
    }
  }
}

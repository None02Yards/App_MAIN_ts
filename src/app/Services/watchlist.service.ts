

// watchlist.services
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface StoredWatchlistItem {
  id: number;
  type: 'movie' | 'tv' | 'anime';
  addedAt?: string;
    name?: string; // ✅ add this if you want to use it in the HTML

}
export interface CustomList {


  id: string;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  items: any[];
  modifiedAt?: string;
    color?: string; // ✅ Add this line

}

export interface WatchlistItem extends StoredWatchlistItem {
  title: string;
  poster_path: string;
}

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private storageKey = 'watchlist';
  private customListsKey = 'customLists';

  private watchlistChangedSource = new Subject<void>();
  watchlistChanged$ = this.watchlistChangedSource.asObservable();

  constructor() {
    this.migrateLegacyWatchlist();
    
  }

  getWatchlist(): StoredWatchlistItem[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private saveWatchlist(list: StoredWatchlistItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  // addToWatchlist(item: StoredWatchlistItem): void {
  //   const list = this.getWatchlist();
  //   const exists = list.some(x => x.id === item.id && x.type === item.type);
  //   if (!exists) {
  //     list.push({ ...item, addedAt: new Date().toISOString() });
  //     this.saveWatchlist(list);
  //   }
  // }

 
  // removeFromWatchlist(id: number, type: 'movie' | 'tv' | 'anime'): void {
  //   const list = this.getWatchlist().filter(item => !(item.id === id && item.type === type));
  //   this.saveWatchlist(list);
  // }

   addToWatchlist(item: StoredWatchlistItem): void {
    const list = this.getWatchlist();
    const exists = list.some(x => x.id === item.id && x.type === item.type);
    if (!exists) {
      list.push({ ...item, addedAt: new Date().toISOString() });
      this.saveWatchlist(list);
      this.watchlistChangedSource.next(); // <== notify listeners
    }
  }

  removeFromWatchlist(id: number, type: 'movie' | 'tv' | 'anime'): void {
    const list = this.getWatchlist().filter(item => !(item.id === id && item.type === type));
    this.saveWatchlist(list);
    this.watchlistChangedSource.next(); // <== notify listeners
  }
  //  Check if item exists
  isInWatchlist(id: number, type: 'movie' | 'tv' | 'anime'): boolean {
    return this.getWatchlist().some(item => item.id === id && item.type === type);
  }

  //  Filter by type
  getByType(type: 'movie' | 'tv' | 'anime'): StoredWatchlistItem[] {
    return this.getWatchlist().filter(item => item.type === type);
  }

  // ✅ Migrate old format (for safety)
  private migrateLegacyWatchlist(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && typeof parsed[0] === 'number') {
        const migrated: StoredWatchlistItem[] = parsed.map((id: number) => ({
          id,
          type: 'movie'
        }));
        this.saveWatchlist(migrated);
        console.log('[WatchlistService] Migrated legacy watchlist format.');
      }
    } catch (err) {
      console.warn('[WatchlistService] Failed to parse legacy watchlist.', err);
    }
  }

  //  ------ CUSTOM LIST SUPPORT ------

  private customLists: {
    id: string;
    name: string;
    description: string;
    privacy: 'public' | 'private';
    items: any[];
  }[] = [];

  createCustomList(list: {
    id: string;
    name: string;
    description: string;
    privacy: 'public' | 'private';
    items: any[];
  }): void {
    this.customLists.push(list);
  }

  getCustomListById(id: string) {
    return this.customLists.find(list => list.id === id);
  }

  
  getCustomLists(): any[] {
    return JSON.parse(localStorage.getItem(this.customListsKey) || '[]');
  }

  saveCustomList(list: any): void {
    const lists = this.getCustomLists();
    lists.push(list);
    localStorage.setItem(this.customListsKey, JSON.stringify(lists));
  }

  updateCustomLists(lists: CustomList[]): void {
  localStorage.setItem('customLists', JSON.stringify(lists));
}


}


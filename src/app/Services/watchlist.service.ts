import { Injectable } from '@angular/core';

export interface StoredWatchlistItem {
  id: number;
  type: 'movie' | 'tv' | 'anime';
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

  constructor() {
    this.migrateLegacyWatchlist();
  }

  getWatchlist(): StoredWatchlistItem[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  addToWatchlist(item: StoredWatchlistItem): void {
    const list = this.getWatchlist();
    const exists = list.some(x => x.id === item.id && x.type === item.type);
    if (!exists) {
      list.push({ id: item.id, type: item.type }); // minimal storage
      this.saveWatchlist(list);
    }
  }

  removeFromWatchlist(id: number, type: 'movie' | 'tv' | 'anime'): void {
    const list = this.getWatchlist().filter(item => !(item.id === id && item.type === type));
    this.saveWatchlist(list);
  }

  isInWatchlist(id: number, type: 'movie' | 'tv' | 'anime'): boolean {
    return this.getWatchlist().some(item => item.id === id && item.type === type);
  }

  getByType(type: 'movie' | 'tv' | 'anime'): StoredWatchlistItem[] {
    return this.getWatchlist().filter(item => item.type === type);
  }

  private saveWatchlist(list: StoredWatchlistItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  private migrateLegacyWatchlist(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && typeof parsed[0] === 'number') {
        const migrated: StoredWatchlistItem[] = parsed.map((id: number) => ({
          id,
          type: 'movie' // default assumption
        }));
        this.saveWatchlist(migrated);
        console.log('[WatchlistService] Migrated legacy watchlist format.');
      }
    } catch (err) {
      console.warn('[WatchlistService] Failed to parse legacy watchlist.', err);
    }
  }
}

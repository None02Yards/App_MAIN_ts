import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  private storageKey = 'watchlist';

  constructor() {}

  getWatchlist(): number[] {
    const list = localStorage.getItem(this.storageKey);
    return list ? JSON.parse(list) : [];
  }

  addToWatchlist(id: number): void {
    const list = this.getWatchlist();
    if (!list.includes(id)) {
      list.push(id);
      this.saveWatchlist(list);
    }
  }

  removeFromWatchlist(id: number): void {
    const list = this.getWatchlist().filter(item => item !== id);
    this.saveWatchlist(list);
  }

  isInWatchlist(id: number): boolean {
    return this.getWatchlist().includes(id);
  }

  private saveWatchlist(list: number[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }
}


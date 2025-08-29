// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { CustomList, WatchlistItem } from './watchlist.service';

// export type MediaKind = 'movie' | 'tv' | 'anime';

// export interface WatchlistMenuState {
//   anchor: HTMLElement;
//   item: WatchlistItem;
//   mediaType: MediaKind;
//   customLists: CustomList[];
// }

// @Injectable({ providedIn: 'root' })
// export class WatchlistMenuService {
//   private _state$ = new BehaviorSubject<WatchlistMenuState | null>(null);
//   readonly changes$ = this._state$.asObservable();

//   open(payload: WatchlistMenuState) { this._state$.next(payload); }
//   close() { this._state$.next(null); }
// }

// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { WatchlistItem, CustomList } from './watchlist.service';

// export interface WatchlistMenuState {
//   anchor: HTMLElement;
//   item?: WatchlistItem;
//   mediaType?: 'movie' | 'tv' | 'anime';
//   customLists?: CustomList[];
// }

// @Injectable({ providedIn: 'root' })
// export class WatchlistMenuService {
//   private menuState = new BehaviorSubject<WatchlistMenuState | null>(null);
//   menuState$ = this.menuState.asObservable();

//   open(state: WatchlistMenuState) {
//     this.menuState.next(state);
//   }

//   close() {
//     this.menuState.next(null);
//   }
// }
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { WatchlistItem, CustomList } from './watchlist.service';

// export interface WatchlistMenuState {
//   anchor: HTMLElement;
//   item?: WatchlistItem;
//   mediaType?: 'movie' | 'tv' | 'anime';
//   customLists?: CustomList[];
// }

// @Injectable({ providedIn: 'root' })
// export class WatchlistMenuService {
//   private _state = new BehaviorSubject<WatchlistMenuState | null>(null);
//   readonly menuState$ = this._state.asObservable();

//   open(state: WatchlistMenuState) { this._state.next(state); }
//   close() { this._state.next(null); }
// }

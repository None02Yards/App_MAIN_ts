

// // src/app/Components/watchlist-global-menu/watchlist-global-menu.component.ts
// import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
// import { Subscription } from 'rxjs';
// import {
//   WatchlistService,
//   StoredWatchlistItem,
//   CustomList,
//   WatchlistItem,
//   WatchlistMenuState,
// } from 'src/app/Services/watchlist.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-watchlist-global-menu',
//   templateUrl: './watchlist-global-menu.component.html',
//   styleUrls: ['./watchlist-global-menu.component.scss'],
// })
// export class WatchlistGlobalMenuComponent implements OnInit, OnDestroy {
//   // visibility + position
//   visible = false;
//   top = 0;
//   left = 0;

//   // main menu flipping (used by your HTML [ngClass])
//   openUpward = false;
//   flipLeft = false;

//   // submenu state (used by your HTML [ngIf]/[ngClass])
//   showSubmenu = false;
//   submenuFlipLeft = false;

//   // payload from the button click (anchor + item + lists)
//   payload?: WatchlistMenuState;

//   private sub?: Subscription;
//   private ignoreFirstDocClick = false;

//   constructor(
// public watchlist: WatchlistService, 
//     private toastr: ToastrService
//   ) {}

//   ngOnInit(): void {
//       console.log('[GlobalMenu] init: subscribing');

//     this.sub = this.watchlist.menuState$.subscribe((state) => {
//           console.log('[GlobalMenu] got state', state);

//       if (!state) {
//         this.visible = false;
//         this.payload = undefined;
//         return;
//       }

//       this.payload = state;
//     // (positioning code as you already have)
//     this.visible = true;

//     // prevent the “open click” from closing immediately
//     this.ignoreFirstDocClick = true;
//     setTimeout(() => (this.ignoreFirstDocClick = false), 40);




//       // --- Position next to the anchor (with flip + clamp) ---
//       const rect = state.anchor.getBoundingClientRect();
//       const vw = window.innerWidth;
//       const vh = window.innerHeight;
//       const scrollX = window.scrollX;
//       const scrollY = window.scrollY;

//       // approximate panel size; CSS will finalize it
//       const w = 240;
//       const h = 320;

//       // base: below-left of the anchor
//       let left = rect.left + scrollX;
//       let top = rect.bottom + scrollY;

//       // horizontal flip if near right edge
//       this.flipLeft = left + w > scrollX + vw - 8;
//       if (this.flipLeft) left = rect.right + scrollX - w;

//       // vertical flip if not enough space below
//       const spaceBelow = vh - rect.bottom;
//       this.openUpward = spaceBelow < h + 20;
//       if (this.openUpward) top = rect.top + scrollY - h;

//       // clamp into viewport (safety)
//       left = Math.max(scrollX + 8, Math.min(left, scrollX + vw - w - 8));
//       top = Math.max(scrollY + 8, Math.min(top, scrollY + vh - h - 8));

//       this.left = left;
//       this.top = top;
//       this.visible = true;

//       // prevent immediate close from the same opening click
//       this.ignoreFirstDocClick = true;
//       setTimeout(() => (this.ignoreFirstDocClick = false), 40);
//     });
//   }

//   ngOnDestroy(): void {
//     this.sub?.unsubscribe();
//   }

//   /* ====== Actions for template ====== */

//   isInWatchlist(): boolean {
//     const p = this.payload;
//     if (!p?.item) return false;
//     const type = p.mediaType ?? 'tv';
//     return this.watchlist.isInWatchlist(p.item.id, type);
//   }

//   toggleGeneralWatchlist(): void {
//     const p = this.payload;
//     if (!p?.item) return;

//     const type = p.mediaType ?? 'tv';
//     const id = p.item.id;

//     if (this.watchlist.isInWatchlist(id, type)) {
//       this.watchlist.removeFromWatchlist(id, type);
//       this.toastr.info('Removed from general watchlist');
//     } else {
//       const stored: StoredWatchlistItem = { id, type };
//       this.watchlist.addToWatchlist(stored);
//       this.toastr.success('Added to general watchlist');
//     }
//     this.watchlist.closeMenu();
//   }

//   isItemInList(list: CustomList): boolean {
//     const p = this.payload;
//     if (!p?.item || !list?.items) return false;
//     return list.items.some((i: any) => i?.id === p.item!.id);
//   }

//   addToCustomList(list: CustomList): void {
//     const p = this.payload;
//     if (!p?.item || !p?.customLists) return;

//     const exists = this.isItemInList(list);
//     if (!list.items) list.items = [];

//     if (exists) {
//       list.items = list.items.filter((i: any) => i?.id !== p.item!.id);
//       this.toastr.info(`Removed from "${list.name}"`);
//     } else {
//       const toPush: WatchlistItem = p.item as WatchlistItem; // keep full card data
//       list.items.push(toPush);
//       this.toastr.success(`Added to "${list.name}"`);
//     }

//     this.watchlist.updateCustomLists(p.customLists);
//     this.watchlist.closeMenu();
//   }

//   onSubmenuEnter(e: MouseEvent) {
//     this.showSubmenu = true;
//     const trigger = e.currentTarget as HTMLElement;
//     const rect = trigger.getBoundingClientRect();
//     const spaceRight = window.innerWidth - rect.right;
//     this.submenuFlipLeft = spaceRight < 220;
//   }
//   onSubmenuLeave() {
//     this.showSubmenu = false;
//   }
// closeFromBackdrop() {
//   this.watchlist.closeMenu();
// }
// onBackdropClick() {
//   this.watchlist.closeMenu();
// }
//   // @HostListener('document:click')
//   // onDocClick() {
//   //   if (this.ignoreFirstDocClick) return;
//   //   if (this.visible) this.watchlist.closeMenu();
//   // }
// @HostListener('document:click', ['$event'])
// onDocClick(_: MouseEvent) {
//   if (this.ignoreFirstDocClick) return;
//   if (this.visible) this.watchlist.closeMenu();
// }

//   @HostListener('window:scroll')
//   onScroll() {
//     if (this.visible) this.watchlist.closeMenu();
//   }

//   @HostListener('document:keydown.escape')
//   onEsc() {
//     if (this.visible) this.watchlist.closeMenu();
//   }
// }


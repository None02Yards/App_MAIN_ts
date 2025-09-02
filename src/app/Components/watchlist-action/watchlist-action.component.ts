


// // src/app/Components/watchlist-action/watchlist-action.component.ts
// import {
//   Component,
//   Input,
//   ElementRef,
//   HostListener,
//   OnDestroy,
//   ViewChild
// } from '@angular/core';
// import {
//   WatchlistService,
//   WatchlistItem,
//   CustomList,
//   StoredWatchlistItem
// } from 'src/app/Services/watchlist.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-watchlist-action',
//   templateUrl: './watchlist-action.component.html',
//   styleUrls: ['./watchlist-action.component.scss'],
// })
// export class WatchlistActionComponent implements OnDestroy {
//   @Input() item!: WatchlistItem;
//   @Input() mediaType: 'movie' | 'tv' | 'anime' = 'tv';
//   @Input() customLists: CustomList[] = [];

//   /** Optional: force the General bucket storage type (e.g., 'anime' on kids) */
//   @Input() generalTypeOverride?: 'movie' | 'tv' | 'anime';

//   /** Optional: force where "View General" routes (/watchlist/<tab>) */
//   @Input() generalTabOverride?: 'movies' | 'tv' | 'animes';

//   @ViewChild('mainMenu') mainMenuRef?: ElementRef<HTMLElement>;

//   // ===== State used by the template =====
//   actionMenuForId: number | null = null;
//   actionMenuItem: WatchlistItem | null = null;

//   get visible(): boolean {
//     return this.actionMenuForId !== null;
//   }

//   /** CSS styles for main menu: { top, left, zIndex } */
//   dropdownPosition: { [k: string]: string } = {};

//   /** Submenu visibility + placement */
//   showSubmenu = false;
//   submenuFlipLeft = false;
//   submenuPosition: { [k: string]: string } = {};

//   // ===== Guards / stability =====
//   private ignoreFirstDocClick = false;
//   private openScrollY = 0;
//   private openAt = 0;
//   private readonly shiverThreshold = 48; // px
//   private submenuCloseTimer: any = null;

//   /** Effective general bucket type (storage + badge state) */
//   private get generalType(): 'movie' | 'tv' | 'anime' {
//     return this.generalTypeOverride ?? this.mediaType;
//   }

//   /** /watchlist/<segment> for the "View General" link */
//   get generalRouteSegment(): 'movies' | 'tv' | 'animes' {
//     if (this.generalTabOverride) return this.generalTabOverride;
//     switch (this.generalType) {            // <-- use effective type
//       case 'movie': return 'movies';
//       case 'anime': return 'animes';
//       default:      return 'tv';
//     }
//   }
//   get generalRoute(): (string | number)[] {
//     return ['/watchlist', this.generalRouteSegment];
//   }

//   constructor(
//     private elRef: ElementRef,
//     private watchlist: WatchlistService,
//     private toastr: ToastrService
//   ) {}

//   /* ---------- helpers used in template ---------- */
//   isInWatchlist(id?: number): boolean {
//     const checkId = id ?? this.item?.id;
//     if (checkId == null) return false;
//     // reflect the overridden general bucket
//     return this.watchlist.isInWatchlist(checkId, this.generalType);
//   }

//   isInAnyCustomList(id?: number): boolean {
//     const checkId = id ?? this.item?.id;
//     if (checkId == null) return false;
//     return this.customLists?.some(l => l.items?.some(i => i?.id === checkId)) ?? false;
//   }

//   isItemInList(item: WatchlistItem, list: CustomList): boolean {
//     return !!list?.items && list.items.some(i => i?.id === item.id);
//   }

//   /* ---------- open main dropdown (fixed) ---------- */
//   open(ev: MouseEvent): void {
//     ev.preventDefault();
//     ev.stopPropagation();

//     const anchor = ev.currentTarget as HTMLElement;
//     const r  = anchor.getBoundingClientRect();
//     const vw = window.innerWidth;
//     const vh = window.innerHeight;

//     const w = 260, h = 320, gutter = 8;

//     let left = r.left;
//     let top  = r.bottom;

//     if (left + w > vw - gutter) left = Math.max(gutter, vw - w - gutter);
//     if (top  + h > vh - gutter) top  = Math.max(gutter, r.top - h);

//     this.dropdownPosition = {
//       top: `${top}px`,
//       left: `${left}px`,
//       zIndex: '2147483000'
//     };

//     this.actionMenuForId = this.item.id;
//     this.actionMenuItem  = this.item;
//     this.showSubmenu     = false;

//     document.body.classList.add('watchlist-open');
//     this.openScrollY = window.scrollY;
//     this.openAt = Date.now();

//     this.ignoreFirstDocClick = true;
//     setTimeout(() => (this.ignoreFirstDocClick = false), 40);
//   }

//   /* ---------- sticky submenu: open from row only (compute once) ---------- */
//   openSubmenuFromRow(event: MouseEvent): void {
//     if (!this.actionMenuForId || !this.actionMenuItem) return;

//     this.showSubmenu = true;

//     const row = event.currentTarget as HTMLElement;     // Save-to-Custom row
//     const rr  = row.getBoundingClientRect();
//     const mr  = this.mainMenuRef?.nativeElement.getBoundingClientRect() ?? rr;

//     const vw = window.innerWidth, vh = window.innerHeight;
//     const sw = 240, sh = 260, gutter = 8, overlap = 2;

//     let left = mr.right - overlap;
//     let top  = rr.top;

//     const roomRight = vw - mr.right;
//     this.submenuFlipLeft = roomRight < sw + gutter;
//     if (this.submenuFlipLeft) left = mr.left - sw + overlap;

//     if (top + sh > vh - gutter) top = Math.max(gutter, rr.bottom - sh);

//     left = Math.max(gutter, Math.min(left, vw - sw - gutter));
//     top  = Math.max(gutter, Math.min(top,  vh - sh - gutter));

//     this.submenuPosition = {
//       top: `${top}px`,
//       left: `${left}px`,
//       zIndex: '2147483001'
//     };
//   }

//   /* ---------- sticky hover helpers ---------- */
//   cancelSubmenuClose(): void {
//     if (this.submenuCloseTimer) {
//       clearTimeout(this.submenuCloseTimer);
//       this.submenuCloseTimer = null;
//     }
//   }

//   scheduleSubmenuClose(): void {
//     if (this.submenuCloseTimer) clearTimeout(this.submenuCloseTimer);
//     this.submenuCloseTimer = setTimeout(() => {
//       this.showSubmenu = false;
//       this.submenuCloseTimer = null;
//     }, 220);
//   }

//   /* ---------- actions ---------- */
//   toggleGeneralWatchlist(item?: WatchlistItem): void {
//     const current = item ?? this.actionMenuItem ?? this.item;
//     if (!current) return;

//     const type = this.generalType;  // <-- override applied here

//     if (this.watchlist.isInWatchlist(current.id, type)) {
//       this.watchlist.removeFromWatchlist(current.id, type);
//       this.toastr.info('Removed from general watchlist');
//     } else {
//       const stored: StoredWatchlistItem = { id: current.id, type };
//       this.watchlist.addToWatchlist(stored);
//       this.toastr.success('Added to general watchlist');
//     }
//     this.closeMenu();
//   }

//   addToCustomList(item: WatchlistItem, list: CustomList): void {
//     if (!list.items) list.items = [];
//     const inList = list.items.some(i => i?.id === item.id);

//     if (inList) {
//       list.items = list.items.filter(i => i?.id !== item.id);
//       this.toastr.info(`Removed from "${list.name}"`);
//     } else {
//       list.items.push(item);
//       this.toastr.success(`Added to "${list.name}"`);
//     }

//     this.watchlist.updateCustomLists(this.customLists);
//     this.closeMenu();
//   }

//   /* ---------- close behaviors ---------- */
//   private closeMenu(): void {
//     this.actionMenuForId = null;
//     this.actionMenuItem  = null;
//     this.showSubmenu     = false;
//     this.submenuPosition = {};
//     if (this.submenuCloseTimer) {
//       clearTimeout(this.submenuCloseTimer);
//       this.submenuCloseTimer = null;
//     }
//     document.body.classList.remove('watchlist-open');
//   }

//   @HostListener('document:click', ['$event'])
//   onDocClick(ev: MouseEvent): void {
//     if (!this.actionMenuForId || this.ignoreFirstDocClick) return;
//     const target = ev.target as HTMLElement;
//     const inside = this.elRef.nativeElement.contains(target);
//     if (!inside) this.closeMenu();
//   }

//   @HostListener('document:keydown.escape')
//   onEsc(): void {
//     if (this.actionMenuForId) this.closeMenu();
//   }

//   @HostListener('window:scroll')
//   onScroll(): void {
//     if (!this.actionMenuForId) return;
//     if (Date.now() - this.openAt < 150) return;
//     if (Math.abs(window.scrollY - this.openScrollY) > this.shiverThreshold) {
//       this.closeMenu();
//     }
//   }

//   ngOnDestroy(): void {
//     this.closeMenu();
//   }
// }


// // src/app/Components/watchlist-action/watchlist-action.component.ts
// import {
//   Component, ChangeDetectorRef, Input, ElementRef, HostListener, OnDestroy, ViewChild
// } from '@angular/core';
// import {
//   WatchlistService, WatchlistItem, CustomList, StoredWatchlistItem
// } from 'src/app/Services/watchlist.service';
// import { ToastrService } from 'ngx-toastr';


// @Component({
//   selector: 'app-watchlist-action',
//   templateUrl: './watchlist-action.component.html',
//   styleUrls: ['./watchlist-action.component.scss'],
// })
// export class WatchlistActionComponent implements OnDestroy {
//   @Input() item!: WatchlistItem;
//   @Input() mediaType: 'movie' | 'tv' | 'anime' = 'tv';
//   @Input() customLists: CustomList[] = [];

//   /** add this so [showIcon]="false" in Details doesn't error */
//   @Input() showIcon = true;

//   /** Optional: force the General bucket storage type (e.g., 'anime' on kids) */
//   @Input() generalTypeOverride?: 'movie' | 'tv' | 'anime';

//   /** Optional: force where "View General" routes (/watchlist/<tab>) */
//   @Input() generalTabOverride?: 'movies' | 'tv' | 'animes';

//   @ViewChild('mainMenu') mainMenuRef?: ElementRef<HTMLElement>;

//   actionMenuForId: number | null = null;
//   actionMenuItem: WatchlistItem | null = null;

//   get visible(): boolean {
//     return this.actionMenuForId !== null;
//   }

//   dropdownPosition: { [k: string]: string } = {};
//   showSubmenu = false;
//   submenuFlipLeft = false;
//   submenuPosition: { [k: string]: string } = {};

//   private ignoreFirstDocClick = false;
//   private openScrollY = 0;
//   private openAt = 0;
//   private readonly shiverThreshold = 48;
//   private submenuCloseTimer: any = null;

//   constructor(
//     private elRef: ElementRef,
//     private watchlist: WatchlistService,
//     private toastr: ToastrService,
//       private cdr: ChangeDetectorRef 
//   ) {}

//   /** Effective general bucket type (storage + badge state) */
//   private get generalType(): 'movie' | 'tv' | 'anime' {
//     return this.generalTypeOverride ?? this.mediaType;
//   }

//   get generalRouteSegment(): 'movies' | 'tv' | 'animes' {
//     if (this.generalTabOverride) return this.generalTabOverride;
//     switch (this.generalType) { case 'movie': return 'movies'; case 'anime': return 'animes'; default: return 'tv'; }
//   }
//   get generalRoute(): (string | number)[] {
//     return ['/watchlist', this.generalRouteSegment];
//   }

//   /* ---------- helpers used in template ---------- */
//   isInWatchlist(id?: number): boolean {
//     const checkId = id ?? this.item?.id;
//     if (checkId == null) return false;
//     return this.watchlist.isInWatchlist(checkId, this.generalType);
//   }
//   isInAnyCustomList(id?: number): boolean {
//     const checkId = id ?? this.item?.id;
//     if (checkId == null) return false;
//     return this.customLists?.some(l => l.items?.some(i => i?.id === checkId)) ?? false;
//   }
//   isItemInList(item: WatchlistItem, list: CustomList): boolean {
//     return !!list?.items && list.items.some(i => i?.id === item.id);
//   }

//   /* ---------- EXTERNAL trigger (Details page) ---------- */
//   openFor(ev: MouseEvent, item: WatchlistItem): void {
//     this.open(ev, item);
//   }

//   /* ---------- open main dropdown (accepts optional item) ---------- */
//   open(ev: MouseEvent, item?: WatchlistItem): void {
//     ev.preventDefault();
//     ev.stopPropagation();

//     const use = item ?? this.item;
//     if (!use) return;

//     const anchor = ev.currentTarget as HTMLElement;
//     const r  = anchor.getBoundingClientRect();
//     const vw = window.innerWidth;
//     const vh = window.innerHeight;

//     const w = 260, h = 320, gutter = 8;
//     let left = r.left;
//     let top  = r.bottom;

//     if (left + w > vw - gutter) left = Math.max(gutter, vw - w - gutter);
//     if (top  + h > vh - gutter) top  = Math.max(gutter, r.top - h);

//     this.dropdownPosition = { top: `${top}px`, left: `${left}px`, zIndex: '2147483000' };

//     this.actionMenuForId = use.id;
//     this.actionMenuItem  = use;
//     this.showSubmenu     = false;

//     document.body.classList.add('watchlist-open');
//     this.openScrollY = window.scrollY;
//     this.openAt = Date.now();

//     this.ignoreFirstDocClick = true;
//     setTimeout(() => (this.ignoreFirstDocClick = false), 40);
//   }

//   /* ---------- sticky submenu: open from row only (more robust) ---------- */
//   // openSubmenuFromRow(event: MouseEvent): void {
//   //   if (!this.actionMenuForId || !this.actionMenuItem) return;

//   //   // prevent doc:click race and hover flicker
//   //   this.ignoreFirstDocClick = true;
//   //   setTimeout(() => (this.ignoreFirstDocClick = false), 40);
//   //   this.cancelSubmenuClose();
//   //   this.showSubmenu = true;

//   //   // compute after layout to avoid zero-rects
//   //   requestAnimationFrame(() => {
//   //     const row = event.currentTarget as HTMLElement;
//   //     const rr  = row.getBoundingClientRect();
//   //     const mr  = this.mainMenuRef?.nativeElement.getBoundingClientRect() ?? rr;

//   //     const vw = window.innerWidth, vh = window.innerHeight;
//   //     const sw = 240, sh = 260, gutter = 8, overlap = 8;

//   //     let left = mr.right - overlap;
//   //     let top  = rr.top;

//   //     const roomRight = vw - mr.right;
//   //     this.submenuFlipLeft = roomRight < sw + gutter;
//   //     if (this.submenuFlipLeft) left = mr.left - sw + overlap;

//   //     if (top + sh > vh - gutter) top = Math.max(gutter, rr.bottom - sh);

//   //     left = Math.max(gutter, Math.min(left, vw - sw - gutter));
//   //     top  = Math.max(gutter, Math.min(top,  vh - sh - gutter));

//   //     this.submenuPosition = { top: `${top}px`, left: `${left}px`, zIndex: '2147483001' };
//   //   });
//   // }

// openSubmenuFromRow(event: MouseEvent): void {
//   if (!this.actionMenuForId || !this.actionMenuItem) return;

//   this.ignoreFirstDocClick = true;
//   setTimeout(() => (this.ignoreFirstDocClick = false), 120); // ⬅️ a bit longer

//   this.cancelSubmenuClose();
//   this.showSubmenu = true;
//   this.cdr.detectChanges(); // ⬅️ ensure submenu exists before measuring

//   requestAnimationFrame(() => {
//     const row = event.currentTarget as HTMLElement;
//     const rr  = row.getBoundingClientRect();
//     const mr  = this.mainMenuRef?.nativeElement.getBoundingClientRect() ?? rr;

//     const vw = window.innerWidth, vh = window.innerHeight;
//     const sw = 240, sh = 260, gutter = 8, overlap = 12; // ⬅️ more overlap = no hover gap

//     let left = mr.right - overlap;
//     let top  = rr.top;

//     const roomRight = vw - mr.right;
//     this.submenuFlipLeft = roomRight < sw + gutter;
//     if (this.submenuFlipLeft) left = mr.left - sw + overlap;

//     if (top + sh > vh - gutter) top = Math.max(gutter, rr.bottom - sh);

//     left = Math.max(gutter, Math.min(left, vw - sw - gutter));
//     top  = Math.max(gutter, Math.min(top,  vh - sh - gutter));

//     this.submenuPosition = { top: `${top}px`, left: `${left}px`, zIndex: '2147483001' };
//     this.cdr.detectChanges(); // ⬅️ paint immediately
//   });
// }


//   /* ---------- sticky hover helpers ---------- */
//   cancelSubmenuClose(): void {
//     if (this.submenuCloseTimer) { clearTimeout(this.submenuCloseTimer); this.submenuCloseTimer = null; }
//   }
//   scheduleSubmenuClose(): void {
//     if (this.submenuCloseTimer) clearTimeout(this.submenuCloseTimer);
//     this.submenuCloseTimer = setTimeout(() => { this.showSubmenu = false; this.submenuCloseTimer = null; }, 220);
//   }

//   /* ---------- actions ---------- */
//   toggleGeneralWatchlist(item?: WatchlistItem): void {
//     const current = item ?? this.actionMenuItem ?? this.item;
//     if (!current) return;

//     const type = this.generalType;
//     if (this.watchlist.isInWatchlist(current.id, type)) {
//       this.watchlist.removeFromWatchlist(current.id, type);
//       this.toastr.info('Removed from general watchlist');
//     } else {
//       const stored: StoredWatchlistItem = { id: current.id, type };
//       this.watchlist.addToWatchlist(stored);
//       this.toastr.success('Added to general watchlist');
//     }
//     this.closeMenu();
//   }
//   addToCustomList(item: WatchlistItem, list: CustomList): void {
//     if (!list.items) list.items = [];
//     const inList = list.items.some(i => i?.id === item.id);
//     if (inList) {
//       list.items = list.items.filter(i => i?.id !== item.id);
//       this.toastr.info(`Removed from "${list.name}"`);
//     } else {
//       list.items.push(item);
//       this.toastr.success(`Added to "${list.name}"`);
//     }
//     this.watchlist.updateCustomLists(this.customLists);
//     this.closeMenu();
//   }

//   /* ---------- close behaviors ---------- */
//   private closeMenu(): void {
//     this.actionMenuForId = null;
//     this.actionMenuItem  = null;
//     this.showSubmenu     = false;
//     this.submenuPosition = {};
//     if (this.submenuCloseTimer) { clearTimeout(this.submenuCloseTimer); this.submenuCloseTimer = null; }
//     document.body.classList.remove('watchlist-open');
//   }

//   @HostListener('document:click', ['$event'])
//   onDocClick(ev: MouseEvent): void {
//     if (!this.actionMenuForId || this.ignoreFirstDocClick) return;
//     const target = ev.target as HTMLElement;
//     const inside = this.elRef.nativeElement.contains(target);
//     if (!inside) this.closeMenu();
//   }
//   @HostListener('document:keydown.escape')
//   onEsc(): void { if (this.actionMenuForId) this.closeMenu(); }

//   @HostListener('window:scroll')
//   onScroll(): void {
//     if (!this.actionMenuForId) return;
//     if (Date.now() - this.openAt < 150) return;
//     if (Math.abs(window.scrollY - this.openScrollY) > this.shiverThreshold) this.closeMenu();
//   }

//   ngOnDestroy(): void { this.closeMenu(); }
// }


// // src/app/Components/watchlist-action/watchlist-action.component.ts
// import {
//   Component, Input, ElementRef, HostListener, OnDestroy, ViewChild, OnChanges, SimpleChanges,
//   ChangeDetectorRef
// } from '@angular/core';

// import {
//   WatchlistService,
//   WatchlistItem,
//   CustomList,
//   StoredWatchlistItem
// } from 'src/app/Services/watchlist.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-watchlist-action',
//   templateUrl: './watchlist-action.component.html',
//   styleUrls: ['./watchlist-action.component.scss'],
// })
// export class WatchlistActionComponent implements OnDestroy, OnChanges {
//   /** The item represented by this button (can be overridden when calling openFor) */
//   @Input() item: WatchlistItem | null = null;

//   /** Base media type of this context (affects general watchlist bucket) */
//   @Input() mediaType: 'movie' | 'tv' | 'anime' = 'tv';

//   /** Custom lists (same shape you use everywhere) */
//   @Input() customLists: CustomList[] = [];

//   /** Hide/show the floating bookmark+plus icon (Details page will hide it) */
//   @Input() showIcon = true;

//   /** Optional: force the General bucket storage type (e.g., 'anime' on kids) */
//   @Input() generalTypeOverride?: 'movie' | 'tv' | 'anime';

//   /** Optional: force where "View General" routes (/watchlist/<tab>) */
//   @Input() generalTabOverride?: 'movies' | 'tv' | 'animes';

//   @ViewChild('mainMenu') mainMenuRef?: ElementRef<HTMLElement>;

//   // ===== State used by the template =====
//   actionMenuForId: number | null = null;
//   actionMenuItem: WatchlistItem | null = null;

//   get visible(): boolean {
//     return this.actionMenuForId !== null;
//   }

//   /** CSS styles for main menu: { top, left, zIndex } */
//   dropdownPosition: { [k: string]: string } = {};

//   /** Submenu visibility + placement */
//   showSubmenu = false;
//   submenuFlipLeft = false;
//   submenuPosition: { [k: string]: string } = {};

//   // ===== Guards / stability =====
//   private ignoreFirstDocClick = false;
//   private openScrollY = 0;
//   private openAt = 0;
//   private readonly shiverThreshold = 48; // px
//   private submenuCloseTimer: any = null;

//   constructor(
//     private elRef: ElementRef,
//     private watchlist: WatchlistService,
//     private toastr: ToastrService,
//     private cdr: ChangeDetectorRef  
//   ) {}

//   ngOnChanges(_: SimpleChanges): void {
//     // nothing required, but hook is here if you later need to normalize inputs
//   }

//   /** Effective general bucket type (storage + badge state) */
//   private get generalType(): 'movie' | 'tv' | 'anime' {
//     return this.generalTypeOverride ?? this.mediaType;
//   }

//   /** /watchlist/<segment> for the "View General" link */
//   get generalRouteSegment(): 'movies' | 'tv' | 'animes' {
//     if (this.generalTabOverride) return this.generalTabOverride;
//     switch (this.generalType) {
//       case 'movie': return 'movies';
//       case 'anime': return 'animes';
//       default:      return 'tv';
//     }
//   }
//   get generalRoute(): (string | number)[] {
//     return ['/watchlist', this.generalRouteSegment];
//   }

//   /* ---------- helpers used in template ---------- */
//   isInWatchlist(id?: number): boolean {
//     const checkId = id ?? this.item?.id ?? undefined;
//     if (checkId == null) return false;
//     return this.watchlist.isInWatchlist(checkId, this.generalType);
//   }

//   isInAnyCustomList(id?: number): boolean {
//     const checkId = id ?? this.item?.id ?? undefined;
//     if (checkId == null) return false;
//     return this.customLists?.some(l => l.items?.some(i => i?.id === checkId)) ?? false;
//   }

//   isItemInList(item: WatchlistItem, list: CustomList): boolean {
//     return !!list?.items && list.items.some(i => i?.id === item.id);
//   }

//   /* ---------- EXTERNAL trigger (Details page) ---------- */
//   openFor(ev: MouseEvent, item: WatchlistItem): void {
//     this.open(ev, item);
//   }

//   /* ---------- open main dropdown (now accepts optional item) ---------- */
//   open(ev: MouseEvent, item?: WatchlistItem): void {
//     ev.preventDefault();
//     ev.stopPropagation();

//     const use = item ?? this.item;
//     if (!use) return;

//     // Position near the clicked element
//     const anchor = ev.currentTarget as HTMLElement;
//     const r  = anchor.getBoundingClientRect();
//     const vw = window.innerWidth;
//     const vh = window.innerHeight;

//     const w = 260, h = 320, gutter = 8;

//     let left = r.left;
//     let top  = r.bottom;

//     if (left + w > vw - gutter) left = Math.max(gutter, vw - w - gutter);
//     if (top  + h > vh - gutter) top  = Math.max(gutter, r.top - h);

//     this.dropdownPosition = {
//       top: `${top}px`,
//       left: `${left}px`,
//       zIndex: '2147483000'
//     };

//     this.actionMenuForId = use.id;
//     this.actionMenuItem  = use;
//     this.showSubmenu     = false;

//     document.body.classList.add('watchlist-open');
//     this.openScrollY = window.scrollY;
//     this.openAt = Date.now();

//     this.ignoreFirstDocClick = true;
//     setTimeout(() => (this.ignoreFirstDocClick = false), 40);
//   }

//   /* ---------- sticky submenu: open from row only (compute once) ---------- */
//   // openSubmenuFromRow(event: MouseEvent): void {
//   //   if (!this.actionMenuForId || !this.actionMenuItem) return;

//   //   this.showSubmenu = true;

//   //   const row = event.currentTarget as HTMLElement;     // Save-to-Custom row
//   //   const rr  = row.getBoundingClientRect();
//   //   const mr  = this.mainMenuRef?.nativeElement.getBoundingClientRect() ?? rr;

//   //   const vw = window.innerWidth, vh = window.innerHeight;
//   //   const sw = 240, sh = 260, gutter = 8, overlap = 2;

//   //   let left = mr.right - overlap;
//   //   let top  = rr.top;

//   //   const roomRight = vw - mr.right;
//   //   this.submenuFlipLeft = roomRight < sw + gutter;
//   //   if (this.submenuFlipLeft) left = mr.left - sw + overlap;

//   //   if (top + sh > vh - gutter) top = Math.max(gutter, rr.bottom - sh);

//   //   left = Math.max(gutter, Math.min(left, vw - sw - gutter));
//   //   top  = Math.max(gutter, Math.min(top,  vh - sh - gutter));

//   //   this.submenuPosition = {
//   //     top: `${top}px`,
//   //     left: `${left}px`,
//   //     zIndex: '2147483001'
//   //   };
//   // }


// openSubmenuFromRow(event: MouseEvent): void {
//   if (!this.actionMenuForId || !this.actionMenuItem) return;

//   // avoid the global document:click immediately closing us
//   this.ignoreFirstDocClick = true;
//   setTimeout(() => (this.ignoreFirstDocClick = false), 120);

//   // make submenu visible so it can be measured
//   this.cancelSubmenuClose();
//   this.showSubmenu = true;
//   this.cdr.detectChanges();

//   // compute after layout
//   requestAnimationFrame(() => {
//     const row = event.currentTarget as HTMLElement;     // the "Save to Custom List" row
//     const rr  = row.getBoundingClientRect();
//     const mr  = this.mainMenuRef?.nativeElement.getBoundingClientRect() ?? rr;

//     const vw = window.innerWidth, vh = window.innerHeight;
//     const sw = 240, sh = 260, gutter = 8, overlap = 12;

//     let left = mr.right - overlap;
//     let top  = rr.top;

//     const roomRight = vw - mr.right;
//     this.submenuFlipLeft = roomRight < sw + gutter;
//     if (this.submenuFlipLeft) left = mr.left - sw + overlap;

//     if (top + sh > vh - gutter) top = Math.max(gutter, rr.bottom - sh);

//     left = Math.max(gutter, Math.min(left, vw - sw - gutter));
//     top  = Math.max(gutter, Math.min(top,  vh - sh - gutter));

//     this.submenuPosition = { top: `${top}px`, left: `${left}px`, zIndex: '2147483001' };
//     this.cdr.detectChanges();
//   });
// }



//   /* ---------- sticky hover helpers ---------- */
//   cancelSubmenuClose(): void {
//     if (this.submenuCloseTimer) {
//       clearTimeout(this.submenuCloseTimer);
//       this.submenuCloseTimer = null;
//     }
//   }

//   scheduleSubmenuClose(): void {
//     if (this.submenuCloseTimer) clearTimeout(this.submenuCloseTimer);
//     this.submenuCloseTimer = setTimeout(() => {
//       this.showSubmenu = false;
//       this.submenuCloseTimer = null;
//     }, 220);
//   }

//   /* ---------- actions ---------- */
//   toggleGeneralWatchlist(item?: WatchlistItem): void {
//     const current = item ?? this.actionMenuItem ?? this.item;
//     if (!current) return;

//     const type = this.generalType;

//     if (this.watchlist.isInWatchlist(current.id, type)) {
//       this.watchlist.removeFromWatchlist(current.id, type);
//       this.toastr.info('Removed from general watchlist');
//     } else {
//       const stored: StoredWatchlistItem = { id: current.id, type };
//       this.watchlist.addToWatchlist(stored);
//       this.toastr.success('Added to general watchlist');
//     }
//     this.closeMenu();
//   }

//   addToCustomList(item: WatchlistItem, list: CustomList): void {
//     if (!list.items) list.items = [];
//     const inList = list.items.some(i => i?.id === item.id);

//     if (inList) {
//       list.items = list.items.filter(i => i?.id !== item.id);
//       this.toastr.info(`Removed from "${list.name}"`);
//     } else {
//       list.items.push(item);
//       this.toastr.success(`Added to "${list.name}"`);
//     }

//     this.watchlist.updateCustomLists(this.customLists);
//     this.closeMenu();
//   }

//   /* ---------- close behaviors ---------- */
//   private closeMenu(): void {
//     this.actionMenuForId = null;
//     this.actionMenuItem  = null;
//     this.showSubmenu     = false;
//     this.submenuPosition = {};
//     if (this.submenuCloseTimer) {
//       clearTimeout(this.submenuCloseTimer);
//       this.submenuCloseTimer = null;
//     }
//     document.body.classList.remove('watchlist-open');
//   }

//   @HostListener('document:click', ['$event'])
//   onDocClick(ev: MouseEvent): void {
//     if (!this.actionMenuForId || this.ignoreFirstDocClick) return;
//     const target = ev.target as HTMLElement;
//     const inside = this.elRef.nativeElement.contains(target);
//     if (!inside) this.closeMenu();
//   }

//   @HostListener('document:keydown.escape')
//   onEsc(): void {
//     if (this.actionMenuForId) this.closeMenu();
//   }

//   @HostListener('window:scroll')
//   onScroll(): void {
//     if (!this.actionMenuForId) return;
//     if (Date.now() - this.openAt < 150) return;
//     if (Math.abs(window.scrollY - this.openScrollY) > this.shiverThreshold) {
//       this.closeMenu();
//     }
//   }

//   ngOnDestroy(): void {
//     this.closeMenu();
//   }
// }


import {
  Component,
  Input,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  WatchlistService,
  WatchlistItem,
  CustomList,
  StoredWatchlistItem
} from 'src/app/Services/watchlist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-watchlist-action',
  templateUrl: './watchlist-action.component.html',
  styleUrls: ['./watchlist-action.component.scss'],
    host: {
    // (prevents routerLink nav on parent <a>)
    '(click)': 'trap($event)',
    '(mousedown)': 'trap($event)',
    '(touchstart)': 'trap($event)',
  },
})
export class WatchlistActionComponent implements OnDestroy, OnChanges {
  /** The item represented by this button (can be overridden when calling openFor) */
  @Input() item: WatchlistItem | null = null;
 trap(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
  @Input() mediaType: 'movie' | 'tv' | 'anime' = 'tv';

  @Input() customLists: CustomList[] = [];

  @Input() showIcon = true;

  @Input() generalTypeOverride?: 'movie' | 'tv' | 'anime';

  @Input() generalTabOverride?: 'movies' | 'tv' | 'animes';

  @ViewChild('mainMenu') mainMenuRef?: ElementRef<HTMLElement>;

  // ===== State used by the template =====
  actionMenuForId: number | null = null;
  actionMenuItem: WatchlistItem | null = null;

  get visible(): boolean {
    return this.actionMenuForId !== null;
  }

  dropdownPosition: { [k: string]: string } = {};

  showSubmenu = false;
  submenuFlipLeft = false;
  submenuPosition: { [k: string]: string } = {};

  // ===== Guards / stability =====
  private ignoreFirstDocClick = false;
  private openScrollY = 0;
  private openAt = 0;
  private readonly shiverThreshold = 48; // px
  private submenuCloseTimer: any = null;

  constructor(
    private elRef: ElementRef,
    private watchlist: WatchlistService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    // nothing required, but hook is here if  later need to normalize inputs
  }

  private get generalType(): 'movie' | 'tv' | 'anime' {
    return this.generalTypeOverride ?? this.mediaType;
  }

  get generalRouteSegment(): 'movies' | 'tv' | 'animes' {
    if (this.generalTabOverride) return this.generalTabOverride;
    switch (this.generalType) {
      case 'movie': return 'movies';
      case 'anime': return 'animes';
      default:      return 'tv';
    }
  }
  get generalRoute(): (string | number)[] {
    return ['/watchlist', this.generalRouteSegment];
  }

  /* ---------- helpers used in template ---------- */
  // isInWatchlist(id?: number): boolean {
  //   const checkId = id ?? this.item?.id ?? undefined;
  //   if (checkId == null) return false;
  //   return this.watchlist.isInWatchlist(checkId, this.generalType);
  // }

  // isInAnyCustomList(id?: number): boolean {
  //   const checkId = id ?? this.item?.id ?? undefined;
  //   if (checkId == null) return false;
  //   return this.customLists?.some(l => l.items?.some(i => i?.id === checkId)) ?? false;
  // }

  // isItemInList(item: WatchlistItem, list: CustomList): boolean {
  //   return !!list?.items && list.items.some(i => i?.id === item.id);
  // }

  /* ---------- EXTERNAL trigger (Details page) ---------- */
  openFor(ev: MouseEvent, item: WatchlistItem): void {
    this.open(ev, item);
  }


private readonly allBuckets: Array<'movie' | 'tv' | 'anime'> = ['movie', 'tv', 'anime'];
private isInAnyGeneral(id: number): boolean {
  return this.allBuckets.some(t => this.watchlist.isInWatchlist(id, t));
}
get generalActionLabel(): string {
  const id = this.getId(this.actionMenuItem ?? this.item);
  if (id == null) return 'Add to Watchlist';
  return (this.isInWatchlist(id) || this.isInAnyGeneral(id) || this.isInAnyCustomList(id))
    ? 'Remove from Watchlist' : 'Add to Watchlist';
}


  /* ---------- open main dropdown (now accepts optional item) ---------- */
  open(ev: MouseEvent, item?: WatchlistItem): void {
    ev.preventDefault();
    ev.stopPropagation();

    const use = item ?? this.item;
    if (!use) return;

    // Position near the clicked element
    const anchor = ev.currentTarget as HTMLElement;
    const r  = anchor.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const w = 260, h = 320, gutter = 8;

    let left = r.left;
    let top  = r.bottom;

    if (left + w > vw - gutter) left = Math.max(gutter, vw - w - gutter);
    if (top  + h > vh - gutter) top  = Math.max(gutter, r.top - h);

    this.dropdownPosition = {
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '2147483000'
    };

    this.actionMenuForId = use.id;
    this.actionMenuItem  = use;
    this.showSubmenu     = false;

    document.body.classList.add('watchlist-open');
    this.openScrollY = window.scrollY;
    this.openAt = Date.now();

    this.ignoreFirstDocClick = true;
    setTimeout(() => (this.ignoreFirstDocClick = false), 40);
  }

  /* ---------- sticky submenu: open from row only (compute once) ---------- */
  openSubmenuFromRow(event: MouseEvent): void {
    if (!this.actionMenuForId || !this.actionMenuItem) return;

    this.showSubmenu = true;

    const row = event.currentTarget as HTMLElement;     // Save-to-Custom row
    const rr  = row.getBoundingClientRect();
    const mr  = this.mainMenuRef?.nativeElement.getBoundingClientRect() ?? rr;

    const vw = window.innerWidth, vh = window.innerHeight;
    const sw = 240, sh = 260, gutter = 8, overlap = 2;

    let left = mr.right - overlap;
    let top  = rr.top;

    const roomRight = vw - mr.right;
    this.submenuFlipLeft = roomRight < sw + gutter;
    if (this.submenuFlipLeft) left = mr.left - sw + overlap;

    if (top + sh > vh - gutter) top = Math.max(gutter, rr.bottom - sh);

    left = Math.max(gutter, Math.min(left, vw - sw - gutter));
    top  = Math.max(gutter, Math.min(top,  vh - sh - gutter));

    this.submenuPosition = {
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '2147483001'
    };
  }

  /* ---------- sticky hover helpers ---------- */
  cancelSubmenuClose(): void {
    if (this.submenuCloseTimer) {
      clearTimeout(this.submenuCloseTimer);
      this.submenuCloseTimer = null;
    }
  }

  scheduleSubmenuClose(): void {
    if (this.submenuCloseTimer) clearTimeout(this.submenuCloseTimer);
    this.submenuCloseTimer = setTimeout(() => {
      this.showSubmenu = false;
      this.submenuCloseTimer = null;
    }, 220);
  }






toggleGeneralWatchlist(item?: WatchlistItem): void {
  const current = item ?? this.actionMenuItem ?? this.item;
  if (!current) return;

  const type = this.generalType;

  this.closeMenu(); 

  if (this.watchlist.isInWatchlist(current.id, type)) {
    this.watchlist.removeFromWatchlist(current.id, type);
    setTimeout(() => this.toastr.info('Removed from general watchlist'), 0);
  } else {
    this.watchlist.addToWatchlist({ id: current.id, type });
    setTimeout(() => this.toastr.success('Added to general watchlist'), 0);
  }
}


  addToCustomList(item: WatchlistItem, list: CustomList): void {
    if (!list.items) list.items = [];
    const inList = list.items.some(i => i?.id === item.id);

    if (inList) {
      list.items = list.items.filter(i => i?.id !== item.id);
      this.toastr.info(`Removed from "${list.name}"`);
    } else {
      list.items.push(item);
      this.toastr.success(`Added to "${list.name}"`);
    }

    this.watchlist.updateCustomLists(this.customLists);
    this.closeMenu();
  }

  // inside WatchlistActionComponent
private getId(raw: any): number | null {
  if (!raw) return null;
  const maybe = (raw.id ?? raw.tmdb_id ?? raw.movie_id ?? raw.show_id);
  if (maybe == null) return null;
  const n = +maybe;
  return Number.isFinite(n) ? n : null;
}

isInWatchlist(id?: number): boolean {
  const checkId = id ?? this.getId(this.item) ?? undefined;
  return checkId == null
    ? false
    : this.watchlist.isInWatchlist(checkId, this.generalType);
}

isInAnyCustomList(id?: number): boolean {
  const checkId = id ?? this.getId(this.item) ?? undefined;
  return checkId == null
    ? false
    : (this.customLists?.some(l => l.items?.some(i => this.getId(i) === checkId)) ?? false);
}

isItemInList(item: WatchlistItem, list: CustomList): boolean {
  const nid = this.getId(item);
  return !!list?.items && list.items.some(i => this.getId(i) === nid);
}


  /* ---------- close behaviors ---------- */
  private closeMenu(): void {
    this.actionMenuForId = null;
    this.actionMenuItem  = null;
    this.showSubmenu     = false;
    this.submenuPosition = {};
    if (this.submenuCloseTimer) {
      clearTimeout(this.submenuCloseTimer);
      this.submenuCloseTimer = null;
    }
    document.body.classList.remove('watchlist-open');
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    if (!this.actionMenuForId || this.ignoreFirstDocClick) return;
    const target = ev.target as HTMLElement;
    const inside = this.elRef.nativeElement.contains(target);
    if (!inside) this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.actionMenuForId) this.closeMenu();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.actionMenuForId) return;
    if (Date.now() - this.openAt < 150) return;
    if (Math.abs(window.scrollY - this.openScrollY) > this.shiverThreshold) {
      this.closeMenu();
    }
  }

  ngOnDestroy(): void {
    this.closeMenu();
  }
}

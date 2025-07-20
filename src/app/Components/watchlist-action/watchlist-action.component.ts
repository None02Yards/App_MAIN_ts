// import {
//   Component,
//   Input,
//   HostListener,
//   ElementRef,
//   OnDestroy
// } from '@angular/core';
// import { WatchlistItem, CustomList, WatchlistService } from 'src/app/Services/watchlist.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-watchlist-action',
//   templateUrl: './watchlist-action.component.html',
//   styleUrls: ['./watchlist-action.component.scss']
// })
// export class WatchlistActionComponent implements OnDestroy {
// @Input() item!: WatchlistItem;
// @Input() mediaType: 'movie' | 'tv' | 'anime' = 'tv';
// @Input() customLists: CustomList[] = [];


//   actionMenuForId: number | null = null;
//   dropdownPosition: { [key: string]: string } = {};
//   showSubmenu = false;
//   submenuFlipLeft = false;

//   constructor(
//     private elRef: ElementRef,
//     private watchlistService: WatchlistService,
//     private toastr: ToastrService
//   ) {}

//   isInWatchlist(): boolean {
//     return this.watchlistService.isInWatchlist(this.item.id, this.mediaType);
//   }

//   isInAnyCustomList(): boolean {
//     return this.customLists.some(list =>
//       list.items.some(i => i.id === this.item.id)
//     );
//   }

//   isItemInList(list: CustomList): boolean {
//     return list.items.some(i => i.id === this.item.id);
//   }

//   toggleGeneralWatchlist(): void {
//     if (this.isInWatchlist()) {
//       this.watchlistService.removeFromWatchlist(this.item.id, this.mediaType);
//       this.toastr.info('Removed from general watchlist');
//     } else {
//       this.watchlistService.addToWatchlist({ id: this.item.id, type: this.mediaType });
//       this.toastr.success('Added to general watchlist');
//     }
//     this.closeActionMenu();
//   }

//   addToCustomList(list: CustomList): void {
//     const alreadyIn = this.isItemInList(list);
//     list.items = alreadyIn
//       ? list.items.filter(i => i.id !== this.item.id)
//       : [...list.items, this.item];

//     this.watchlistService.updateCustomLists(this.customLists);
//     this.toastr[alreadyIn ? 'info' : 'success'](
//       `${alreadyIn ? 'Removed from' : 'Added to'} "${list.name}"`
//     );

//     this.closeActionMenu();
//   }

//   openActionMenu(e: MouseEvent): void {
//     e.stopPropagation();
//     this.showSubmenu = false;

//     const target = e.currentTarget as HTMLElement;
//     const rect = target.getBoundingClientRect();
//     const scrollY = window.scrollY;
//     const pageH = window.innerHeight;
//     const dropdownHeight = 690; // Adjust if needed
//     const top = Math.min(rect.top + scrollY + target.offsetHeight, scrollY + pageH - dropdownHeight);
//     const left = rect.left + window.scrollX;

//     this.dropdownPosition = {
//       top: `${top}px`,
//       left: `${left}px`,
//       zIndex: '9999'
//     };

//     this.actionMenuForId = this.item.id;
//   }

//   closeActionMenu(): void {
//     this.actionMenuForId = null;
//     this.showSubmenu = false;
//   }

//   onSubmenuMouseEnter(event: MouseEvent) {
//     this.showSubmenu = true;
//     const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
//     this.submenuFlipLeft = window.innerWidth - rect.right < 200; // submenu width
//   }

//   onSubmenuMouseLeave() {
//     this.showSubmenu = false;
//   }

//   // ✅ Make the dropdown close on outside click / scroll / ESC:
//   @HostListener('document:click', ['$event'])
//   onDocClick(event: MouseEvent) {
//     const clickedInside = this.elRef.nativeElement.contains(event.target);
//     if (!clickedInside) this.closeActionMenu();
//   }

//   @HostListener('window:scroll')
//   onScroll() {
//     this.closeActionMenu();
//   }

//   @HostListener('document:keydown.escape')
//   onEscKey() {
//     this.closeActionMenu();
//   }

//   ngOnDestroy(): void {
//     this.closeActionMenu();
//   }
// }

import {
  Component,
  Input,
  HostListener,
  ElementRef,
  OnDestroy
} from '@angular/core';
import {
  WatchlistItem,
  CustomList,
  WatchlistService
} from 'src/app/Services/watchlist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-watchlist-action',
  templateUrl: './watchlist-action.component.html',
  styleUrls: ['./watchlist-action.component.scss']
})
export class WatchlistActionComponent implements OnDestroy {
  @Input() item!: WatchlistItem;
  @Input() mediaType: 'movie' | 'tv' | 'anime' = 'tv';
  @Input() customLists: CustomList[] = [];

  actionMenuForId: number | null = null;
  dropdownPosition: { [key: string]: string } = {};
  showSubmenu = false;
  submenuFlipLeft = false;

  constructor(
    private elRef: ElementRef,
    private watchlistService: WatchlistService,
    private toastr: ToastrService
  ) {}

  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(this.item.id, this.mediaType);
  }

  isInAnyCustomList(): boolean {
    return this.customLists.some(list =>
      list.items.some(i => i.id === this.item.id)
    );
  }

  isItemInList(list: CustomList): boolean {
    return list.items.some(i => i.id === this.item.id);
  }

  toggleGeneralWatchlist(): void {
    if (this.isInWatchlist()) {
      this.watchlistService.removeFromWatchlist(this.item.id, this.mediaType);
      this.toastr.info('Removed from general watchlist');
    } else {
      this.watchlistService.addToWatchlist({
        id: this.item.id,
        type: this.mediaType
      });
      this.toastr.success('Added to general watchlist');
    }
    this.closeActionMenu();
  }

  addToCustomList(list: CustomList): void {
    const alreadyIn = this.isItemInList(list);
    list.items = alreadyIn
      ? list.items.filter(i => i.id !== this.item.id)
      : [...list.items, this.item];

    this.watchlistService.updateCustomLists(this.customLists);
    this.toastr[alreadyIn ? 'info' : 'success'](
      `${alreadyIn ? 'Removed from' : 'Added to'} "${list.name}"`
    );
    this.closeActionMenu();
  }

  openActionMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.showSubmenu = false;
  

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const scrollY = window.scrollY;
    const pageH = window.innerHeight;
    const dropdownHeight = 690;
    const top = Math.min(
      rect.top + scrollY + target.offsetHeight,
      scrollY + pageH - dropdownHeight
    );
    const left = rect.left + window.scrollX;

    this.dropdownPosition = {
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '9999'
    };

    this.actionMenuForId = this.item.id;
  }

  closeActionMenu(): void {
    this.actionMenuForId = null;
    this.showSubmenu = false;

  }

  onSubmenuMouseEnter(event: MouseEvent) {
    this.showSubmenu = true;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.submenuFlipLeft = window.innerWidth - rect.right < 200;
  }

  onSubmenuMouseLeave() {
    this.showSubmenu = false;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) this.closeActionMenu();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.closeActionMenu();
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeActionMenu();
  }

  ngOnDestroy(): void {
    this.closeActionMenu();
  }
}

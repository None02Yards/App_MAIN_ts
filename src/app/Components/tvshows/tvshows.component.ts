
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as AOS from 'aos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { DataService } from 'src/app/Services/data.service';
import {
  WatchlistService,
  WatchlistItem,
  CustomList
} from 'src/app/Services/watchlist.service';

@Component({
  selector: 'app-tvshows',
  templateUrl: './tvshows.component.html',
  styleUrls: ['./tvshows.component.scss']
})
export class TVShowsComponent implements OnInit {
  type = '';
  pageTitle = '';
  page = 1;

  tvShows: any[] = [];
  displayedShows: any[] = [];

  customLists: CustomList[] = [];

  // dropdown state
  actionMenuForId: number | null = null;
  actionMenuItem: WatchlistItem | null = null;
  dropdownPosition: { [k: string]: string } = {};

  showSubmenu = false;
  submenuFlipLeft = false;

  disablePrev = true;
  disableNext = false;
  notice = true;
totalPages: number = 1;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {

    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });

    this.route.params.subscribe(() => {
      this.type = this.route.snapshot.paramMap.get('genre') || '';
      this.page = Number(this.route.snapshot.paramMap.get('page')) || 1;
      this.customLists = this.watchlistService.getCustomLists();
      this.pageTitle = this.getTitle(this.type);
      this.fetchShows();
    });
  }

  private getTitle(type: string): string {
    switch(type) {
      case 'on_the_air':    return 'On The Air';
      case 'popular':       return 'Popular TV Shows';
      case 'top_rated':     return 'Top Rated Shows';
      case 'airing_today':  return 'Airing Today';
      default:              return 'TV Shows';
    }
  }

fetchShows(): void {
  this.dataService.getData('tv', this.type, this.page)
    .subscribe(res => {
      this.tvShows = (res.results || []).filter((m: any) => m.poster_path);
      this.totalPages = res.total_pages || 1;
      this.displayedShows = this.tvShows.slice(0, 12);
      this.updatePaginationButtons();
    });
}


 updatePaginationButtons(): void {
  this.disablePrev = this.page <= 1;
  this.disableNext = this.page >= this.totalPages;
}


  Next(): void {
    if (!this.disableNext) {
      this.page++;
      this.fetchShows();
    }
  }

  Prev(): void {
    if (!this.disablePrev) {
      this.page--;
      this.fetchShows();
    }
  }

  trackById(_: number, item: any): number {
    return item.id;
  }

  // ——— Watchlist logic ———

  isInWatchlist(id: number): boolean {
    return this.watchlistService.isInWatchlist(id, 'tv');
  }

  isInAnyCustomList(id: number): boolean {
    return this.customLists.some(l => l.items.some(i => i.id === id));
  }

  isItemInList(item: WatchlistItem, list: CustomList): boolean {
    return list.items.some(i => i.id === item.id);
  }

  toggleGeneralWatchlist(item: WatchlistItem): void {
    if (this.isInWatchlist(item.id)) {
      this.watchlistService.removeFromWatchlist(item.id, 'tv');
      this.toastr.info('Removed from general watchlist');
    } else {
      this.watchlistService.addToWatchlist({ id: item.id, type: 'tv' });
      this.toastr.success('Added to general watchlist');
    }
    this.closeActionMenu();
  }

  addToCustomList(item: WatchlistItem, list: CustomList): void {
    if (!this.isItemInList(item, list)) {
      list.items.push(item);
      this.toastr.success(`Added to "${list.name}"`);
    } else {
      list.items = list.items.filter(i => i.id !== item.id);
      this.toastr.info(`Removed from "${list.name}"`);
    }
    this.watchlistService.updateCustomLists(this.customLists);
    this.closeActionMenu();
  }

  // ——— Dropdown positioning + control ———

  openActionMenu(item: any, e: MouseEvent) {
    e.stopPropagation();
    this.showSubmenu = false;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ddHeight = 690;     // approx dropdown height
    const padding = 10;
    const scrollY = window.scrollY;
    const pageH = window.innerHeight;

    // clamp top so that menu never spills below viewport
    const candidateTop = rect.top + scrollY + target.offsetHeight;
    const maxTop = scrollY + pageH - ddHeight - padding;
    const top = Math.min(candidateTop, maxTop);

    // align left
    const left = rect.left + window.scrollX;

    this.dropdownPosition = {
      top:   `${top}px`,
      left:  `${left}px`,
      zIndex:`9999`
    };

    this.actionMenuForId   = item.id;
    this.actionMenuItem    = item;
  }

  closeActionMenu() {
    this.actionMenuForId = null;
    this.actionMenuItem  = null;
    this.showSubmenu     = false;
  }



  onSubmenuMouseEnter(event: MouseEvent) {
  this.showSubmenu = true;
  // find submenu width & screen space
  const trigger = event.currentTarget as HTMLElement;
  const rect = trigger.getBoundingClientRect();
  const submenuWidth = 200 + 8; // your min-width + padding/margin
  const spaceRight = window.innerWidth - rect.right;
  this.submenuFlipLeft = spaceRight < submenuWidth;
}
onSubmenuMouseLeave() {
  this.showSubmenu = false;
}
  // ——— Close on outside-click, scroll or ESC ———

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (
      !el.closest('.spotify-dropdown') &&
      !el.classList.contains('overlay-btn')
    ) {
      this.closeActionMenu();
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.closeActionMenu();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeActionMenu();
  }
}

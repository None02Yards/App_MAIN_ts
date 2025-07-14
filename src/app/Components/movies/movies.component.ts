
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { DataService } from 'src/app/Services/data.service';
import {
  WatchlistService,
  WatchlistItem,
  CustomList
} from 'src/app/Services/watchlist.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})


export class MoviesComponent implements OnInit {
  type = '';
  pageTitle = '';
  page = 1;

  Movies: any[] = [];
  displayedMovies: any[] = [];
    rowsOfSix: any[][] = [];   

  customLists: CustomList[] = [];

  
  // dropdown state
  actionMenuForId: number | null = null;
  actionMenuItem: any = null;
  dropdownPosition: { [k: string]: string } = {};

  showSubmenu = false;
submenuFlipLeft = false;

  disablePrev = true;
  disableNext = false;
  notice = true;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.type = this.route.snapshot.paramMap.get('genre') || '';
      this.page = Number(this.route.snapshot.paramMap.get('page')) || 1;
      this.customLists = this.watchlistService.getCustomLists();
      this.pageTitle = this.getTitle(this.type);
      this.fetchMovies();
    });
  }

  private getTitle(type: string): string {
    switch(type) {
      case 'now_playing': return 'Now Playing';
      case 'popular':     return 'Popular Movies';
      case 'top_rated':   return 'Top Rated Movies';
      case 'upcoming':    return 'Upcoming Movies';
      default:            return 'Movies';
    }
  }

 fetchMovies(): void {
    this.spinner.show();
    this.dataService.getData('movie', this.type, this.page).subscribe(res => {
      this.spinner.hide();
      this.notice = res.success;
      this.Movies = (res.results || []).filter((m: any) => m.poster_path);
      // grab exactly 12
      this.displayedMovies = this.Movies.slice(0, 12);
      this.updatePaginationButtons();
    });
  }

  trackById(_: number, item: any) {
    return item.id;
  }

  updatePaginationButtons() {
    this.disablePrev = this.page <= 1;
    this.disableNext = this.Movies.length < 12;
  }

  Next() { if (!this.disableNext) { this.page++; this.fetchMovies(); } }
  Prev() { if (!this.disablePrev) { this.page--; this.fetchMovies(); } }

  // ——— Watchlist logic ———
  isInWatchlist(id: number) {
    return this.watchlistService.isInWatchlist(id, 'movie');
  }
  
  isInAnyCustomList(id: number) {
    return this.customLists.some(l => l.items.some(i => i.id === id));
  }

  isItemInList(item: WatchlistItem, list: CustomList) {
    return list.items.some(i => i.id === item.id);
  }  

  toggleGeneralWatchlist(item: WatchlistItem) {
    if (this.isInWatchlist(item.id)) {
      this.watchlistService.removeFromWatchlist(item.id, 'movie');
      this.toastr.info('Removed from watchlist');
    } else {
      this.watchlistService.addToWatchlist({ id: item.id, type: 'movie' });
      this.toastr.success('Added to watchlist');
    }
    this.closeActionMenu();
  }

  addToCustomList(item: WatchlistItem, list: CustomList) {
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

    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ddH = 700, padding = 10;
    const scrollY = window.scrollY;

    // clamp top so it never runs below viewport
    const candidate = rect.top + scrollY + target.offsetHeight;
    const maxTop = scrollY + window.innerHeight - ddH - padding;
    const top = Math.min(candidate, maxTop);

    this.dropdownPosition = {
      top: `${top}px`,
      left: `${rect.left + window.scrollX}px`,
      zIndex: '9999'
    };
    this.actionMenuForId = item.id;
    this.actionMenuItem = item;
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
  closeActionMenu() {
    this.actionMenuForId = null;
    this.actionMenuItem = null;
    this.showSubmenu = false;
  }



  // outside click
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
  onScroll() { this.closeActionMenu(); }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc() { this.closeActionMenu(); }
}

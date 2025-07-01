

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { DataService } from 'src/app/Services/data.service';
import { WatchlistService, WatchlistItem, CustomList  } from 'src/app/Services/watchlist.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  type: string = '';
  pageTitle: string = '';
  page: number = 1;

  Movies: any[] = [];
  displayedMovies: any[] = [];
dropdownVisibleForId: number | null = null;
showListMenuForId: number | null = null;    // Which movie's sub-menu (custom list) is open


customLists: CustomList[] = [];

  disablePrev = true;
  disableNext = false;
  notice = true;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
     private toastr: ToastrService,
    private watchlistService: WatchlistService // ✅ Injected
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.type = this.route.snapshot.paramMap.get('genre') || '';
      this.page = Number(this.route.snapshot.paramMap.get('page')) || 1;
       this.customLists = this.watchlistService.getCustomLists();

      switch (this.type) {
        case 'now_playing':
          this.pageTitle = 'Now Playing';
          break;
        case 'popular':
          this.pageTitle = 'Popular Movies';
          break;
        case 'top_rated':
          this.pageTitle = 'Top Rated Movies';
          break;
        case 'upcoming':
          this.pageTitle = 'Upcoming Movies';
          break;
        default:
          this.pageTitle = 'Movies';
      }

      this.fetchMovies();
    });
  }

  Next(): void {
    if (!this.disableNext) {
      this.page++;
      this.fetchMovies();
    }
  }

  Prev(): void {
    if (!this.disablePrev) {
      this.page--;
      this.fetchMovies();
    }
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  fetchMovies(): void {
    this.spinner.show();

    this.dataService.getData('movie', this.type, this.page).subscribe(response => {
      this.spinner.hide();

      this.notice = response.success;
      this.Movies = (response.results || []).filter((item: any) => item.poster_path);
      this.displayedMovies = this.Movies.slice(0, 12);
      this.updatePaginationButtons();
    });
  }


toggleDropdown(id: number): void {
  this.dropdownVisibleForId = this.dropdownVisibleForId === id ? null : id;
  this.showListMenuForId = null;
}

openCustomListMenu(id: number): void {
  this.showListMenuForId = id;
}

closeCustomListMenu(): void {
  this.showListMenuForId = null;
}

addToGeneralWatchlist(item: WatchlistItem): void {
  if (this.isInWatchlist(item.id)) {
    this.watchlistService.removeFromWatchlist(item.id, 'movie');
    this.toastr.info('Removed from general watchlist');
  } else {
    // Only pass what your service expects!
    this.watchlistService.addToWatchlist({ id: item.id, type: 'movie' });
    this.toastr.success('Added to general watchlist');
  }
  this.dropdownVisibleForId = null;
}






  // ✅ Controls pagination buttons
  updatePaginationButtons(): void {
    this.disablePrev = this.page <= 1;
    this.disableNext = this.Movies.length === 0 || this.Movies.length < 12;
  }



isInAnyCustomList(itemId: number): boolean {
  return this.customLists.some(list => list.items.some(i => i.id === itemId));
}

isItemInList(item: WatchlistItem, list: CustomList): boolean {
  return list.items.some(i => i.id === item.id);
}
addToCustomList(item: WatchlistItem, list: CustomList): void {
  if (!this.isItemInList(item, list)) {
    list.items.push(item);
    this.watchlistService.updateCustomLists(this.customLists);
    this.toastr.success(`Added to "${list.name}"`);
  } else {
    this.toastr.info(`Already in "${list.name}"`);
  }

  this.dropdownVisibleForId = null;
}
// movies.component.ts

toggleCustomListItem(item: WatchlistItem, list: CustomList): void {
  if (this.isItemInList(item, list)) {
    // Remove from list
    list.items = list.items.filter(i => i.id !== item.id);
    this.watchlistService.updateCustomLists(this.customLists);
    this.toastr.info(`Removed from "${list.name}"`);
  } else {
    // Add to list
    list.items.push(item);
    this.watchlistService.updateCustomLists(this.customLists);
    this.toastr.success(`Added to "${list.name}"`);
  }
  this.dropdownVisibleForId = null;
}




// Check if in general watchlist
isInWatchlist(movieId: number): boolean {
  return this.watchlistService.isInWatchlist(movieId, 'movie');
}

// Add/remove from general watchlist (like TV)
toggleGeneralWatchlist(item: WatchlistItem): void {
  if (this.isInWatchlist(item.id)) {
    this.watchlistService.removeFromWatchlist(item.id, 'movie');
    this.toastr.info('Removed from general watchlist');
  } else {
    this.watchlistService.addToWatchlist({ id: item.id, type: 'movie' });
    this.toastr.success('Added to general watchlist');
  }
  this.dropdownVisibleForId = null;
}


}

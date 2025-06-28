

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

  // ✅ Handles pagination
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

  // ✅ Used for ngFor trackBy
  trackById(index: number, item: any): number {
    return item.id;
  }

  // ✅ Core data fetcher
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

  // ✅ Controls pagination buttons
  updatePaginationButtons(): void {
    this.disablePrev = this.page <= 1;
    this.disableNext = this.Movies.length === 0 || this.Movies.length < 12;
  }

  // ✅ Check if movie is in watchlist using the service
  isInWatchlist(movieId: number): boolean {
    return this.watchlistService.isInWatchlist(movieId, 'movie');
  }

  // ✅ Toggle using service
  // toggleWatchlist(movie: any): void {
  //   const isSaved = this.watchlistService.isInWatchlist(movie.id, 'movie');

  //   if (isSaved) {
  //     this.watchlistService.removeFromWatchlist(movie.id, 'movie');
  //   } else {
  //     this.watchlistService.addToWatchlist({ id: movie.id, type: 'movie' });
  //   }
  // }

  toggleWatchlist(item: WatchlistItem): void {
  const customLists = this.watchlistService.getCustomLists();

  if (customLists.length > 0) {
    // Prompt the user to pick a list
    const choice = prompt(
      'Choose a custom list:\n' +
      customLists.map((list, i) => `${i + 1}. ${list.name}`).join('\n')
    );

    const index = parseInt(choice || '', 10) - 1;
    const selectedList = customLists[index];

    if (selectedList) {
      selectedList.items.push(item);
      this.watchlistService.updateCustomLists(customLists);
      alert(`✅ Added to "${selectedList.name}"`);
    }
  } else {
    this.watchlistService.addToWatchlist(item);
    alert(`✅ Added to general watchlist`);
  }
}

toggleDropdown(id: number): void {
  this.dropdownVisibleForId = this.dropdownVisibleForId === id ? null : id;
}

// addToCustomList(item: WatchlistItem, list: CustomList): void {
//   list.items.push(item);
//   this.watchlistService.updateCustomLists(this.customLists);
//   this.dropdownVisibleForId = null;
//   alert(`✅ Added to "${list.name}"`);
// }
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
}

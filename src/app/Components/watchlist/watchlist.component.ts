// watchlist.component.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { WatchlistService, WatchlistItem } from 'src/app/Services/watchlist.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})


export class WatchlistComponent implements OnInit {

  
  childRouteActive = false;
  movies: WatchlistItem[] = [];
  tvShows: WatchlistItem[] = [];
  animes: WatchlistItem[] = [];

  // 👇 Custom List form fields
  customLists: string[] = [];
  newListName: string = '';
  newListDesc: string = '';
  newListPrivacy: 'public' | 'private' = 'public';
  isCreateListModalOpen: boolean = false;
lastCreatedListId: string | null = null;

  constructor(
    private dataService: DataService,
    private watchlistService: WatchlistService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
generateListId(): string {
  return Math.random().toString(36).substr(2, 9); // Generates a short unique ID
}
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.route.snapshot.firstChild?.routeConfig?.path;
        this.childRouteActive = !!currentRoute;
      }
    });
 const savedId = localStorage.getItem('lastCreatedListId');
  if (savedId) {
    this.lastCreatedListId = savedId;
  }
    const savedItems = this.watchlistService.getWatchlist();
    savedItems.forEach(item => {
      this.dataService.getDetails(item.type, item.id).subscribe(data => {
        const enriched: WatchlistItem = {
          id: item.id,
          type: item.type,
          title: data.title || data.name,
          poster_path: data.poster_path
        };

        switch (item.type) {
          case 'movie':
            this.movies.push(enriched);
            break;
          case 'tv':
            this.tvShows.push(enriched);
            break;
          case 'anime':
            this.animes.push(enriched);
            break;
        }
      });
    });
  }
goToCustomList(): void {
  this.router.navigate(['/watchlist/custom']);
}
  removeFromWatchlist(id: number, type: 'movie' | 'tv' | 'anime'): void {
    this.watchlistService.removeFromWatchlist(id, type);

    switch (type) {
      case 'movie':
        this.movies = this.movies.filter(item => item.id !== id);
        break;
      case 'tv':
        this.tvShows = this.tvShows.filter(item => item.id !== id);
        break;
      case 'anime':
        this.animes = this.animes.filter(item => item.id !== id);
        break;
    }
  }

  // Trigger Create List form
  openCreateListModal(): void {
    this.isCreateListModalOpen = true;
  }

createCustomList() {
  const newListId = Date.now().toString();

  const newList = {
    id: newListId,
    name: this.newListName,
    description: this.newListDesc,
    privacy: this.newListPrivacy,
    items: []
  };

  this.watchlistService.saveCustomList(newList);
  this.lastCreatedListId = newListId;
  localStorage.setItem('lastCreatedListId', newListId);

  this.resetListForm();
  this.newListName = '';
  this.newListDesc = '';
  this.newListPrivacy = 'public';
  this.isCreateListModalOpen = false;

  // ✅ Corrected navigation with ID
  this.router.navigate(['/watchlist/custom', newListId]);
}

  //  Cancel and reset the form
  cancelCreate(): void {
    this.resetListForm();
  }

  // Reusable reset function
  private resetListForm(): void {
    this.newListName = '';
    this.newListDesc = '';
    this.newListPrivacy = 'public';
    this.isCreateListModalOpen = false;
  }
}


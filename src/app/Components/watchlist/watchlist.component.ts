
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

  constructor(
    private dataService: DataService,
    private watchlistService: WatchlistService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.route.snapshot.firstChild?.routeConfig?.path;
        this.childRouteActive = !!currentRoute;
      }
    });

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

  createCustomList(): void {
    if (!this.newListName.trim()) {
      alert('List name is required.');
      return;
    }

    const newList = {
      name: this.newListName,
      description: this.newListDesc,
      privacy: this.newListPrivacy
    };

    this.customLists.push(newList.name); // Or store the full object

    // Reset form and close modal
    this.resetListForm();
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


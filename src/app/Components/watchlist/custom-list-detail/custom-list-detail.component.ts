import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WatchlistService, CustomList } from 'src/app/Services/watchlist.service';

@Component({
  selector: 'app-custom-list-detail',
  templateUrl: './custom-list-detail.component.html',
  styleUrls: ['./custom-list-detail.component.scss']
})
export class CustomListDetailComponent implements OnInit {
  customList: CustomList | undefined;
  customLists: CustomList[] = [];
  activeMenuId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    this.customLists = this.watchlistService.getCustomLists();
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      this.customList = this.customLists.find(l => l.id === listId);
    }
  }

  toggleMenu(id: string): void {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  viewList(list: CustomList): void {
    console.log('View', list);
  }

  editList(list: CustomList): void {
    console.log('Edit', list);
  }

  deleteList(id: string): void {
    this.customLists = this.customLists.filter(list => list.id !== id);
    this.watchlistService.updateCustomLists(this.customLists);
  }

  exportList(list: CustomList): void {
    console.log('Exporting list:', list);
  }

  getPoster(path: string): string {
    return `https://image.tmdb.org/t/p/w300${path}`;
  }
}

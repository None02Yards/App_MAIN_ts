

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WatchlistService, CustomList } from 'src/app/Services/watchlist.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})
export class CreateListComponent implements OnInit {
  customLists: CustomList[] = [];
  selectedList: CustomList | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    this.customLists = this.watchlistService.getCustomLists();

    const listId = this.route.snapshot.queryParamMap.get('id');
    if (listId) {
      const found = this.customLists.find(list => list.id === listId);
      this.selectedList = found || null;
    }
  }

  viewList(list: CustomList): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: list.id },
      queryParamsHandling: 'merge'
    });
    this.selectedList = list;
  }

  guessMediaType(items: any[]): 'tv' | 'movie' {
    return items?.[0]?.title ? 'movie' : 'tv';
  }

  removeItemFromList(itemId: number): void {
    if (this.selectedList) {
      this.selectedList.items = this.selectedList.items.filter(item => item.id !== itemId);
      this.watchlistService.updateCustomLists(this.customLists);
    }
  }
}


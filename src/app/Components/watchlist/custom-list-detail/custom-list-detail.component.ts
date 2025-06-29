import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WatchlistService, CustomList } from 'src/app/Services/watchlist.service';
import { Router } from '@angular/router'; // import it


@Component({
  selector: 'app-custom-list-detail',
  templateUrl: './custom-list-detail.component.html',
  styleUrls: ['./custom-list-detail.component.scss']
})
export class CustomListDetailComponent implements OnInit {
  customLists: CustomList[] = [];
  activeMenuId: string | null = null;
  editingListId: string | null = null;

  colorOptions: string[] = [
    '#f44336', '#e91e63', '#9c27b0',
    '#3f51b5', '#2196f3', '#009688',
    '#4caf50', '#ff9800', '#795548',
    '#607d8b', '#ffffff', '#000000'
  ];

  constructor(
    private route: ActivatedRoute,
    private watchlistService: WatchlistService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.customLists = this.watchlistService.getCustomLists();
  }

  toggleMenu(id: string): void {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

viewList(list: CustomList): void {
  this.router.navigate(['/create-list'], { queryParams: { id: list.id } });
}
  editList(listId: string): void {
    this.editingListId = listId;
    this.activeMenuId = null;
  }

  cancelEdit(): void {
    this.editingListId = null;
  }

  saveEdit(list: CustomList): void {
    this.watchlistService.updateCustomLists(this.customLists);
    this.editingListId = null;
  }

  setColor(list: CustomList, color: string): void {
    list.color = color;
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

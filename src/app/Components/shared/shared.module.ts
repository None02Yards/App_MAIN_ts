
// shared.modue.ts

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WatchlistCardComponent } from './watchlist-card/watchlist-card.component';

@NgModule({
  declarations: [ WatchlistCardComponent ],
  exports: [ WatchlistCardComponent ],
  imports: [ CommonModule, RouterModule ]
})
export class SharedModule {}


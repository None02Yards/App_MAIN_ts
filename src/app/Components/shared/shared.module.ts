// shared.module.ts

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WatchlistCardComponent } from './watchlist-card/watchlist-card.component';
import { RatingCircleComponent } from '../../shared/rating-circle/rating-circle.component'; // 👈 Import it
import { FreeToWatchComponent } from '../free-to-watch/free-to-watch.component';

@NgModule({
  declarations: [
    WatchlistCardComponent,
    RatingCircleComponent,
    FreeToWatchComponent // 👈 Declare it
  ],
  exports: [
    WatchlistCardComponent,
    RatingCircleComponent,
    FreeToWatchComponent // 👈 Export it too
  ],
  imports: [ CommonModule, RouterModule ]
})
export class SharedModule {}

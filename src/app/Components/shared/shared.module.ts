// shared.module.ts

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WatchlistCardComponent } from './watchlist-card/watchlist-card.component';
import { RatingCircleComponent } from '../../shared/rating-circle/rating-circle.component'; // 👈 Import it
import { FreeToWatchComponent } from '../free-to-watch/free-to-watch.component';
import { LatestTrailersComponent } from '../latest-trailers/latest-trailers.component'; // ✅ Import it
import { WatchlistActionComponent } from '../watchlist-action/watchlist-action.component';

@NgModule({
  declarations: [
    WatchlistCardComponent,
    RatingCircleComponent,
    FreeToWatchComponent,
      LatestTrailersComponent,
      WatchlistActionComponent,
  ],
  exports: [
    WatchlistCardComponent,
    RatingCircleComponent,
    FreeToWatchComponent,
    LatestTrailersComponent,
    WatchlistActionComponent,
  ],
  imports: [ CommonModule, RouterModule ]
})
export class SharedModule {}

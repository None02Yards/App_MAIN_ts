import { TestBed } from '@angular/core/testing';

import { WatchlistMenuService } from './watchlist-menu.service';

describe('WatchlistMenuService', () => {
  let service: WatchlistMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

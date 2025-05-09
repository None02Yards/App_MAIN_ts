import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvWatchlistComponent } from './tv-watchlist.component';

describe('TvWatchlistComponent', () => {
  let component: TvWatchlistComponent;
  let fixture: ComponentFixture<TvWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TvWatchlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TvWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

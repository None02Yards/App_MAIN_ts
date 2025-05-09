import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeWatchlistComponent } from './anime-watchlist.component';

describe('AnimeWatchlistComponent', () => {
  let component: AnimeWatchlistComponent;
  let fixture: ComponentFixture<AnimeWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeWatchlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

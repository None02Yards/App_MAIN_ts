import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesWatchlistComponent } from './movies-watchlist.component';
describe('MoviesWatchlistComponent', () => {
  let component: MoviesWatchlistComponent;
  let fixture: ComponentFixture<MoviesWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoviesWatchlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

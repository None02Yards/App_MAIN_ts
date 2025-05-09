import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistCardComponent } from './watchlist-card.component';

describe('WatchlistCardComponent', () => {
  let component: WatchlistCardComponent;
  let fixture: ComponentFixture<WatchlistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchlistCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

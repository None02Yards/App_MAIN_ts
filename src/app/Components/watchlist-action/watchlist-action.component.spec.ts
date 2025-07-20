import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistActionComponent } from './watchlist-action.component';

describe('WatchlistActionComponent', () => {
  let component: WatchlistActionComponent;
  let fixture: ComponentFixture<WatchlistActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchlistActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

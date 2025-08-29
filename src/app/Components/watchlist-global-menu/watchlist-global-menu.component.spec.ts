import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistGlobalMenuComponent } from './watchlist-global-menu.component';

describe('WatchlistGlobalMenuComponent', () => {
  let component: WatchlistGlobalMenuComponent;
  let fixture: ComponentFixture<WatchlistGlobalMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchlistGlobalMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistGlobalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

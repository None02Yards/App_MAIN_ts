import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTrailersComponent } from './latest-trailers.component';

describe('LatestTrailersComponent', () => {
  let component: LatestTrailersComponent;
  let fixture: ComponentFixture<LatestTrailersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestTrailersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestTrailersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

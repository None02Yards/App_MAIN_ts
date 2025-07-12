import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingCircleComponent } from './rating-circle.component';

describe('RatingCircleComponent', () => {
  let component: RatingCircleComponent;
  let fixture: ComponentFixture<RatingCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingCircleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

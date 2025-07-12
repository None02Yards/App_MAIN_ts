import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeToWatchComponent } from './free-to-watch.component';

describe('FreeToWatchComponent', () => {
  let component: FreeToWatchComponent;
  let fixture: ComponentFixture<FreeToWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeToWatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeToWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

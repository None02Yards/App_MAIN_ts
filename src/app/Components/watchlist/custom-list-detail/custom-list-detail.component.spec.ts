import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomListDetailComponent } from './custom-list-detail.component';

describe('CustomListDetailComponent', () => {
  let component: CustomListDetailComponent;
  let fixture: ComponentFixture<CustomListDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomListDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

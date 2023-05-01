import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateCirclesComponent } from './state-circles.component';

describe('StateCirclesComponent', () => {
  let component: StateCirclesComponent;
  let fixture: ComponentFixture<StateCirclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateCirclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

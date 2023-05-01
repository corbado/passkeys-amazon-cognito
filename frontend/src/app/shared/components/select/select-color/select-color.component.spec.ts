import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectColorComponent } from './select-color.component';

describe('SelectComponent', () => {
  let component: SelectColorComponent;
  let fixture: ComponentFixture<SelectColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectColorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

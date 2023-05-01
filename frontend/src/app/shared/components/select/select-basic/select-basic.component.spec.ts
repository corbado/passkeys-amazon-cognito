import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBasicComponent } from './select-basic.component';

describe('SelectBasicComponent', () => {
  let component: SelectBasicComponent;
  let fixture: ComponentFixture<SelectBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputIconedComponent } from './text-input-iconed.component';

describe('TextInputIconedComponent', () => {
  let component: TextInputIconedComponent;
  let fixture: ComponentFixture<TextInputIconedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextInputIconedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextInputIconedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

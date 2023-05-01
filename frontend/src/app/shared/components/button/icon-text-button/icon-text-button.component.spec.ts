import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTextButtonComponent } from './icon-text-button.component';

describe('IconTextButtonComponent', () => {
  let component: IconTextButtonComponent;
  let fixture: ComponentFixture<IconTextButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconTextButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconTextButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

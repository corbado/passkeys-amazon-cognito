import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportBarComponent } from './support-bar.component';

describe('SupportBarComponent', () => {
  let component: SupportBarComponent;
  let fixture: ComponentFixture<SupportBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

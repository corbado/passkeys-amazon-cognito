import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceSelectorComponent } from './space-selector.component';

describe('SpaceSelectorComponent', () => {
  let component: SpaceSelectorComponent;
  let fixture: ComponentFixture<SpaceSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

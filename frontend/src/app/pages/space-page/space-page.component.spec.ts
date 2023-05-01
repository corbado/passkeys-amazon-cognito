import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacePageComponent } from './space-page.component';

describe('SpacePageComponent', () => {
  let component: SpacePageComponent;
  let fixture: ComponentFixture<SpacePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpacePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpacePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

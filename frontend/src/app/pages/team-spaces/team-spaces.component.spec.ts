import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSpacesComponent } from './team-spaces.component';

describe('SpacesComponent', () => {
  let component: TeamSpacesComponent;
  let fixture: ComponentFixture<TeamSpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamSpacesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

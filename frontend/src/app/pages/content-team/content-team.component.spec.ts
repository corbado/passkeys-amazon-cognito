import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTeamComponent } from './content-team.component';

describe('ContentTeamComponent', () => {
  let component: ContentTeamComponent;
  let fixture: ComponentFixture<ContentTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

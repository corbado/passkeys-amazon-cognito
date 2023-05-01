import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationDialogComponent } from './invitation-dialog.component';

describe('InvitationDialogComponent', () => {
  let component: InvitationDialogComponent;
  let fixture: ComponentFixture<InvitationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

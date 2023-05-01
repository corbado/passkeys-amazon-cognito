import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNewComponent } from './settings-new.component';

describe('SettingsNewComponent', () => {
  let component: SettingsNewComponent;
  let fixture: ComponentFixture<SettingsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

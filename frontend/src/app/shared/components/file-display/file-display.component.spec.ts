import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDisplayComponent } from './file-display.component';

describe('FileDisplayComponent', () => {
  let component: FileDisplayComponent;
  let fixture: ComponentFixture<FileDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

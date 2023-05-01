import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLightComponent } from './register-light.component';

describe('RegisterLightComponent', () => {
  let component: RegisterLightComponent;
  let fixture: ComponentFixture<RegisterLightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterLightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

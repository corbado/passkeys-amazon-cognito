import { TestBed } from '@angular/core/testing';

import { SettingsUserService } from './settings-user.service';

describe('SettingsUserService', () => {
  let service: SettingsUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

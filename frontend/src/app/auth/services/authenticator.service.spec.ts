import { TestBed } from '@angular/core/testing';

import { AuthenticatorService } from './authenticator.service';

describe('AuthenticatorService', () => {
  let service: AuthenticatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ErrorInterceptorService } from './error-interceptor.service';

describe('ErrorInterceptorService', () => {
  let service: ErrorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

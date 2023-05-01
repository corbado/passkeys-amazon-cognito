import { TestBed } from '@angular/core/testing';

import { RefreshComponentsService } from '../services/refresh-components.service';

describe('RefreshComponentsService', () => {
  let service: RefreshComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { InquiriesService } from './inquiries.service';

describe('InquiriesService', () => {
  let service: InquiriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InquiriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

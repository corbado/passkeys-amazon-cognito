import { TestBed } from '@angular/core/testing';

import { CompanyCategoryService } from './company-category.service';

describe('CompanyCategoryService', () => {
  let service: CompanyCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

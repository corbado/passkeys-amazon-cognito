import { TestBed } from '@angular/core/testing';

import { ProductCategoryService } from './product-category.service';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

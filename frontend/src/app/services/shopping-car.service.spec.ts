import { TestBed } from '@angular/core/testing';

import { ShoppingCarService } from './shopping-car.service';

describe('ShoppingCarService', () => {
  let service: ShoppingCarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingCarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

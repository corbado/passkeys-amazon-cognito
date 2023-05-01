import { TestBed } from '@angular/core/testing';
import { SpaceService } from './space.service';

describe('SpaceService', () => {
  let service: SpaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

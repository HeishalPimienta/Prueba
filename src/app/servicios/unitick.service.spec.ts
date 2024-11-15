import { TestBed } from '@angular/core/testing';

import { UnitickService } from './unitick.service';

describe('UnitickService', () => {
  let service: UnitickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { EnvServiceService } from './env-service.service';

describe('EnvServiceService', () => {
  let service: EnvServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

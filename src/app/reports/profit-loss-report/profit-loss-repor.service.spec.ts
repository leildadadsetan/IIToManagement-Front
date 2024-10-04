import { TestBed } from '@angular/core/testing';

import { ProfitLossReporService } from './profit-loss-report.service';

describe('ProfitLossReporService', () => {
  let service: ProfitLossReporService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfitLossReporService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

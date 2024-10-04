import { TestBed } from '@angular/core/testing';

import { SalesPurchaseReportService } from './sales-purchase-report.service';

describe('SalesPurchaseReportService', () => {
  let service: SalesPurchaseReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesPurchaseReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { WarehouseStockReportService } from './warehouse-stock-report.service';

describe('WarehouseStockReportService', () => {
  let service: WarehouseStockReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseStockReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

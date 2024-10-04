import { TestBed } from '@angular/core/testing';

import { ProductWarehouseReportService } from './product-warehouse-report.service';

describe('ProductWarehouseReportService', () => {
  let service: ProductWarehouseReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductWarehouseReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

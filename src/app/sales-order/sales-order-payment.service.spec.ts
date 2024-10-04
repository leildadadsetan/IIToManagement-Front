import { TestBed } from '@angular/core/testing';

import { SalesOrderPaymentService } from './sales-order-payment.service';

describe('SalesOrderPaymentService', () => {
  let service: SalesOrderPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesOrderPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

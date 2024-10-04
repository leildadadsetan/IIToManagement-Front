import { TestBed } from '@angular/core/testing';

import { PurchaseOrderPaymentService } from './purchase-order-payment.service';

describe('PurchaseOrderPaymentService', () => {
  let service: PurchaseOrderPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseOrderPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

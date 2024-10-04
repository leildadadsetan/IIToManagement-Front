import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePaymentReportComponent } from './purchase-payment-report.component';

describe('PurchasePaymentReportComponent', () => {
  let component: PurchasePaymentReportComponent;
  let fixture: ComponentFixture<PurchasePaymentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasePaymentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

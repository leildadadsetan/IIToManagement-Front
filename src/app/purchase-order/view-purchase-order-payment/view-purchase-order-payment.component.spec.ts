import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchaseOrderPaymentComponent } from './view-purchase-order-payment.component';

describe('ViewPurchaseOrderPaymentComponent', () => {
  let component: ViewPurchaseOrderPaymentComponent;
  let fixture: ComponentFixture<ViewPurchaseOrderPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPurchaseOrderPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPurchaseOrderPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

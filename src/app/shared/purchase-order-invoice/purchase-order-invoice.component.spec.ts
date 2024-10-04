import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderInvoiceComponent } from './purchase-order-invoice.component';

describe('PurchaseOrderInvoiceComponent', () => {
  let component: PurchaseOrderInvoiceComponent;
  let fixture: ComponentFixture<PurchaseOrderInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

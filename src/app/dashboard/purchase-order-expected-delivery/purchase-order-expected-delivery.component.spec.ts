import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderExpectedDeliveryComponent } from './purchase-order-expected-delivery.component';

describe('PurchaseOrderExpectedDeliveryComponent', () => {
  let component: PurchaseOrderExpectedDeliveryComponent;
  let fixture: ComponentFixture<PurchaseOrderExpectedDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderExpectedDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderExpectedDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

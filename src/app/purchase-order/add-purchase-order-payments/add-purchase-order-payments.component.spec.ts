import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseOrderPaymentsComponent } from './add-purchase-order-payments.component';

describe('AddPurchaseOrderPaymentsComponent', () => {
  let component: AddPurchaseOrderPaymentsComponent;
  let fixture: ComponentFixture<AddPurchaseOrderPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPurchaseOrderPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPurchaseOrderPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

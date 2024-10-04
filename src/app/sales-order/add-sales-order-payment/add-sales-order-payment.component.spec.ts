import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesOrderPaymentComponent } from './add-sales-order-payment.component';

describe('AddSalesOrderPaymentComponent', () => {
  let component: AddSalesOrderPaymentComponent;
  let fixture: ComponentFixture<AddSalesOrderPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSalesOrderPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesOrderPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

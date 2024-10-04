import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalesOrderPaymentComponent } from './view-sales-order-payment.component';

describe('ViewSalesOrderPaymentComponent', () => {
  let component: ViewSalesOrderPaymentComponent;
  let fixture: ComponentFixture<ViewSalesOrderPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSalesOrderPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalesOrderPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

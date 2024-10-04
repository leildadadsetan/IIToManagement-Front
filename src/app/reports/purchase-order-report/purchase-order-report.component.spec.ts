import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderReportComponent } from './purchase-order-report.component';

describe('PurchaseOrderReportComponent', () => {
  let component: PurchaseOrderReportComponent;
  let fixture: ComponentFixture<PurchaseOrderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

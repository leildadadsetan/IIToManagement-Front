import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPaymentReportComponent } from './sales-payment-report.component';

describe('SalesPaymentReportComponent', () => {
  let component: SalesPaymentReportComponent;
  let fixture: ComponentFixture<SalesPaymentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPaymentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

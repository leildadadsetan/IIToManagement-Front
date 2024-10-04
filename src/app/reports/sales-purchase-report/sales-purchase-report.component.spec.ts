import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPurchaseReportComponent } from './sales-purchase-report.component';

describe('SalesPurchaseReportComponent', () => {
  let component: SalesPurchaseReportComponent;
  let fixture: ComponentFixture<SalesPurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPurchaseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPurchaseReportComponent } from './product-purchase-report.component';

describe('ProductPurchaseReportComponent', () => {
  let component: ProductPurchaseReportComponent;
  let fixture: ComponentFixture<ProductPurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPurchaseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

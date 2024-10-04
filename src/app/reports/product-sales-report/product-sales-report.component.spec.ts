import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSalesReportComponent } from './product-sales-report.component';

describe('ProductSalesReportComponent', () => {
  let component: ProductSalesReportComponent;
  let fixture: ComponentFixture<ProductSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

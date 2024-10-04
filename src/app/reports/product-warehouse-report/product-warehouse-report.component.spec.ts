import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWarehouseReportComponent } from './product-warehouse-report.component';

describe('ProductWarehouseReportComponent', () => {
  let component: ProductWarehouseReportComponent;
  let fixture: ComponentFixture<ProductWarehouseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductWarehouseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductWarehouseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseStockReportComponent } from './warehouse-stock-report.component';

describe('WarehouseStockReportComponent', () => {
  let component: WarehouseStockReportComponent;
  let fixture: ComponentFixture<WarehouseStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseStockReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

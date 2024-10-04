import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderExpectedShipmentComponent } from './sales-order-expected-shipment.component';

describe('SalesOrderExpectedShipmentComponent', () => {
  let component: SalesOrderExpectedShipmentComponent;
  let fixture: ComponentFixture<SalesOrderExpectedShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderExpectedShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderExpectedShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

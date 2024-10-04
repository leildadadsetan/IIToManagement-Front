import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderRequestListComponent } from './purchase-order-request-list.component';

describe('PurchaseOrderRequestListComponent', () => {
  let component: PurchaseOrderRequestListComponent;
  let fixture: ComponentFixture<PurchaseOrderRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

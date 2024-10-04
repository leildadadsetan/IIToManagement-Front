import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderRequestItemsComponent } from './purchase-order-request-items.component';

describe('PurchaseOrderRequestItemsComponent', () => {
  let component: PurchaseOrderRequestItemsComponent;
  let fixture: ComponentFixture<PurchaseOrderRequestItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderRequestItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderRequestItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

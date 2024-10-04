import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderItemComponent } from './purchase-order-item.component';

describe('PurchaseOrderItemComponent', () => {
  let component: PurchaseOrderItemComponent;
  let fixture: ComponentFixture<PurchaseOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

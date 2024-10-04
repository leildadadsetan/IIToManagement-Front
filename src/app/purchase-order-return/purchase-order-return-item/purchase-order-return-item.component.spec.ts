import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderReturnItemComponent } from './purchase-order-return-item.component';

describe('PurchaseOrderReturnItemComponent', () => {
  let component: PurchaseOrderReturnItemComponent;
  let fixture: ComponentFixture<PurchaseOrderReturnItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderReturnItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderReturnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

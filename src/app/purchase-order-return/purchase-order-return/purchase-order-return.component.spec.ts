import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderReturnComponent } from './purchase-order-return.component';

describe('PurchaseOrderReturnComponent', () => {
  let component: PurchaseOrderReturnComponent;
  let fixture: ComponentFixture<PurchaseOrderReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

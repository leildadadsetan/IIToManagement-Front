import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderReturnListComponent } from './purchase-order-return-list.component';

describe('PurchaseOrderReturnListComponent', () => {
  let component: PurchaseOrderReturnListComponent;
  let fixture: ComponentFixture<PurchaseOrderReturnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderReturnListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderReturnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

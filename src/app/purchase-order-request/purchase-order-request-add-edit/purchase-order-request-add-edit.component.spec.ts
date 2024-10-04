import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderRequestAddEditComponent } from './purchase-order-request-add-edit.component';

describe('PurchaseOrderRequestAddEditComponent', () => {
  let component: PurchaseOrderRequestAddEditComponent;
  let fixture: ComponentFixture<PurchaseOrderRequestAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderRequestAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderRequestAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

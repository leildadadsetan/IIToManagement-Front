import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderAddEditComponent } from './purchase-order-add-edit.component';

describe('PurchaseOrderAddEditComponent', () => {
  let component: PurchaseOrderAddEditComponent;
  let fixture: ComponentFixture<PurchaseOrderAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

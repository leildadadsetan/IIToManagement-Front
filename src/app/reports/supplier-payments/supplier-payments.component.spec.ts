import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentsComponent } from './supplier-payments.component';

describe('SupplierPaymentsComponent', () => {
  let component: SupplierPaymentsComponent;
  let fixture: ComponentFixture<SupplierPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

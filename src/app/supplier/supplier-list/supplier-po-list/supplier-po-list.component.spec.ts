import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPOListComponent } from './supplier-po-list.component';

describe('SupplierPOListComponent', () => {
  let component: SupplierPOListComponent;
  let fixture: ComponentFixture<SupplierPOListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPOListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPOListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

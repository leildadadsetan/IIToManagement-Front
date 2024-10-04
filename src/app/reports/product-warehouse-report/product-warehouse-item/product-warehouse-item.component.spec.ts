import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWarehouseItemComponent } from './product-warehouse-item.component';

describe('ProductWarehouseItemComponent', () => {
  let component: ProductWarehouseItemComponent;
  let fixture: ComponentFixture<ProductWarehouseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductWarehouseItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductWarehouseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

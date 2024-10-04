import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseProductItemsComponent } from './warehouse-product-items.component';

describe('WarehouseProductItemsComponent', () => {
  let component: WarehouseProductItemsComponent;
  let fixture: ComponentFixture<WarehouseProductItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseProductItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseProductItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

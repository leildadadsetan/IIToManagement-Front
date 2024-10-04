import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderReturnItemComponent } from './sale-order-return-item.component';

describe('SaleOrderReturnItemComponent', () => {
  let component: SaleOrderReturnItemComponent;
  let fixture: ComponentFixture<SaleOrderReturnItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOrderReturnItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderReturnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

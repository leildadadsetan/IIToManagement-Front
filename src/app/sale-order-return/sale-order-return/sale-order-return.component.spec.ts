import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderReturnComponent } from './sale-order-return.component';

describe('SaleOrderReturnComponent', () => {
  let component: SaleOrderReturnComponent;
  let fixture: ComponentFixture<SaleOrderReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOrderReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

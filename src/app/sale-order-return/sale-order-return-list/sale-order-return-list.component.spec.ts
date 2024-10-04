import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderReturnListComponent } from './sale-order-return-list.component';

describe('SaleOrderReturnListComponent', () => {
  let component: SaleOrderReturnListComponent;
  let fixture: ComponentFixture<SaleOrderReturnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOrderReturnListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderReturnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

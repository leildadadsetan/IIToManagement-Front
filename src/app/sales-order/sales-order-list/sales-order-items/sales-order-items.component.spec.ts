import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderItemsComponent } from './sales-order-items.component';

describe('SalesOrderItemsComponent', () => {
  let component: SalesOrderItemsComponent;
  let fixture: ComponentFixture<SalesOrderItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

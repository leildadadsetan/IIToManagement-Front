import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderAddEditComponent } from './sales-order-add-edit.component';

describe('SalesOrderAddEditComponent', () => {
  let component: SalesOrderAddEditComponent;
  let fixture: ComponentFixture<SalesOrderAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

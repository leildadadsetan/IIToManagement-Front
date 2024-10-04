import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWarehouseComponent } from './manage-warehouse.component';

describe('ManageWarehouseComponent', () => {
  let component: ManageWarehouseComponent;
  let fixture: ComponentFixture<ManageWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageWarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

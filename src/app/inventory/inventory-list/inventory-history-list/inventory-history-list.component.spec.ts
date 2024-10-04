import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryHistoryListComponent } from './inventory-history-list.component';

describe('InventoryHistoryListComponent', () => {
  let component: InventoryHistoryListComponent;
  let fixture: ComponentFixture<InventoryHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryHistoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

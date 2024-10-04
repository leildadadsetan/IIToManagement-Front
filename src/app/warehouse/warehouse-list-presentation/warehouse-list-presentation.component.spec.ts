import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseListPresentationComponent } from './warehouse-list-presentation.component';

describe('WarehouseListPresentationComponent', () => {
  let component: WarehouseListPresentationComponent;
  let fixture: ComponentFixture<WarehouseListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

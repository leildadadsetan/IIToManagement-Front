import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExpenseCategoryComponent } from './manage-expense-category.component';

describe('ManageExpenseCategoryComponent', () => {
  let component: ManageExpenseCategoryComponent;
  let fixture: ComponentFixture<ManageExpenseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageExpenseCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCategoryListPresentationComponent } from './expense-category-list-presentation.component';

describe('ExpenseCategoryListPresentationComponent', () => {
  let component: ExpenseCategoryListPresentationComponent;
  let fixture: ComponentFixture<ExpenseCategoryListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseCategoryListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseCategoryListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductCategoryComponent } from './manage-product-category.component';

describe('ManageProductCategoryComponent', () => {
  let component: ManageProductCategoryComponent;
  let fixture: ComponentFixture<ManageProductCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProductCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

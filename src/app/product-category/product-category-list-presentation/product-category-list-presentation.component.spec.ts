import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryListPresentationComponent } from './product-category-list-presentation.component';

describe('ProductCategoryListPresentationComponent', () => {
  let component: ProductCategoryListPresentationComponent;
  let fixture: ComponentFixture<ProductCategoryListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCategoryListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSellingProductComponent } from './best-selling-product.component';

describe('BestSellingProductComponent', () => {
  let component: BestSellingProductComponent;
  let fixture: ComponentFixture<BestSellingProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestSellingProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSellingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

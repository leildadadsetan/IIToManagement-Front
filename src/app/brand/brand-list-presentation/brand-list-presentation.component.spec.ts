import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandListPresentationComponent } from './brand-list-presentation.component';

describe('BrandListPresentationComponent', () => {
  let component: BrandListPresentationComponent;
  let fixture: ComponentFixture<BrandListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

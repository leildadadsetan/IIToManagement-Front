import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryProductListComponent } from './inquiry-product-list.component';

describe('InquiryProductListComponent', () => {
  let component: InquiryProductListComponent;
  let fixture: ComponentFixture<InquiryProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryProductListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

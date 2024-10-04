import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestInquiryComponent } from './latest-inquiry.component';

describe('LatestInquiryComponent', () => {
  let component: LatestInquiryComponent;
  let fixture: ComponentFixture<LatestInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestInquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

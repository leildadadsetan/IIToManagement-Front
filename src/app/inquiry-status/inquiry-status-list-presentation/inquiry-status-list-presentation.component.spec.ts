import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryStatusListPresentationComponent } from './inquiry-status-list-presentation.component';

describe('InquiryStatusListPresentationComponent', () => {
  let component: InquiryStatusListPresentationComponent;
  let fixture: ComponentFixture<InquiryStatusListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryStatusListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryStatusListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryAttachmentComponent } from './inquiry-attachment.component';

describe('InquiryAttachmentComponent', () => {
  let component: InquiryAttachmentComponent;
  let fixture: ComponentFixture<InquiryAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryAttachmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

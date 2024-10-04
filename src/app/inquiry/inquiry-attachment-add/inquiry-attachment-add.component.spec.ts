import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryAttachmentAddComponent } from './inquiry-attachment-add.component';

describe('InquiryAttachmentAddComponent', () => {
  let component: InquiryAttachmentAddComponent;
  let fixture: ComponentFixture<InquiryAttachmentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryAttachmentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryAttachmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

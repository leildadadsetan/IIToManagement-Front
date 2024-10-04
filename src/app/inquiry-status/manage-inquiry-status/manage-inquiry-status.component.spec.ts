import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInquiryStatusComponent } from './manage-inquiry-status.component';

describe('ManageInquiryStatusComponent', () => {
  let component: ManageInquiryStatusComponent;
  let fixture: ComponentFixture<ManageInquiryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageInquiryStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageInquiryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

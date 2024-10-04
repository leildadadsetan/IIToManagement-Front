import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInquirySourceComponent } from './manage-inquiry-source.component';

describe('ManageInquirySourceComponent', () => {
  let component: ManageInquirySourceComponent;
  let fixture: ComponentFixture<ManageInquirySourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageInquirySourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageInquirySourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

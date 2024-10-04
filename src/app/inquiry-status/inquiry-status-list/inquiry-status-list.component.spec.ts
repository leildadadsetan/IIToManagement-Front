import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryStatusListComponent } from './inquiry-status-list.component';

describe('InquiryStatusListComponent', () => {
  let component: InquiryStatusListComponent;
  let fixture: ComponentFixture<InquiryStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryStatusListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

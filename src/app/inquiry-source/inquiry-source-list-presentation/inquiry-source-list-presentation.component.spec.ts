import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquirySourceListPresentationComponent } from './inquiry-source-list-presentation.component';

describe('InquirySourceListPresentationComponent', () => {
  let component: InquirySourceListPresentationComponent;
  let fixture: ComponentFixture<InquirySourceListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquirySourceListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquirySourceListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

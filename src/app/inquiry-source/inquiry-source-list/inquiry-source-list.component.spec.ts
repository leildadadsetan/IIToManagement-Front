import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquirySourceListComponent } from './inquiry-source-list.component';

describe('InquirySourceListComponent', () => {
  let component: InquirySourceListComponent;
  let fixture: ComponentFixture<InquirySourceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquirySourceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquirySourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

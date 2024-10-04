import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryNoteComponent } from './inquiry-note.component';

describe('InquiryNoteComponent', () => {
  let component: InquiryNoteComponent;
  let fixture: ComponentFixture<InquiryNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryTaskComponent } from './inquiry-task.component';

describe('InquiryTaskComponent', () => {
  let component: InquiryTaskComponent;
  let fixture: ComponentFixture<InquiryTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryTaskAddComponent } from './inquiry-task-add.component';

describe('InquiryTaskAddComponent', () => {
  let component: InquiryTaskAddComponent;
  let fixture: ComponentFixture<InquiryTaskAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryTaskAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryTaskAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialDetailComponent } from './testimonial-detail.component';

describe('TestimonialDetailComponent', () => {
  let component: TestimonialDetailComponent;
  let fixture: ComponentFixture<TestimonialDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

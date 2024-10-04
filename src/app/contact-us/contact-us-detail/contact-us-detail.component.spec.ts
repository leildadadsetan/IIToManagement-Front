import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsDetailComponent } from './contact-us-detail.component';

describe('ContactUsDetailComponent', () => {
  let component: ContactUsDetailComponent;
  let fixture: ComponentFixture<ContactUsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

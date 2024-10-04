import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReminderSchedulerComponent } from './add-reminder-scheduler.component';

describe('AddReminderSchedulerComponent', () => {
  let component: AddReminderSchedulerComponent;
  let fixture: ComponentFixture<AddReminderSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReminderSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReminderSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitConversationListComponent } from './unit-conversation-list.component';

describe('UnitConversationListComponent', () => {
  let component: UnitConversationListComponent;
  let fixture: ComponentFixture<UnitConversationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitConversationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitConversationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

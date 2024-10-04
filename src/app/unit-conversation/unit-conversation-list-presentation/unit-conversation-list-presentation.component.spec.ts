import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitConversationListPresentationComponent } from './unit-conversation-list-presentation.component';

describe('UnitConversationListPresentationComponent', () => {
  let component: UnitConversationListPresentationComponent;
  let fixture: ComponentFixture<UnitConversationListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitConversationListPresentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitConversationListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

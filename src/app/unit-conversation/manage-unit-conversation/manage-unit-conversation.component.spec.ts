import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUnitConversationComponent } from './manage-unit-conversation.component';

describe('ManageUnitConversationComponent', () => {
  let component: ManageUnitConversationComponent;
  let fixture: ComponentFixture<ManageUnitConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUnitConversationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUnitConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

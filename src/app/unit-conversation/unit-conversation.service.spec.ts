import { TestBed } from '@angular/core/testing';

import { UnitConversationService } from './unit-conversation.service';

describe('UnitConversationService', () => {
  let service: UnitConversationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitConversationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

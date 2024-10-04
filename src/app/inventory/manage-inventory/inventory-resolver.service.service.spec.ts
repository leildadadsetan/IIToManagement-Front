import { TestBed } from '@angular/core/testing';

import { InventoryResolverService } from './inventory-resolver.service';

describe('InventoryResolverService', () => {
  let service: InventoryResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

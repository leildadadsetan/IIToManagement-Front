import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSoListComponent } from './customer-so-list.component';

describe('CustomerSoListComponent', () => {
  let component: CustomerSoListComponent;
  let fixture: ComponentFixture<CustomerSoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

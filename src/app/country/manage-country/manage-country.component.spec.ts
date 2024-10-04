import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCountryComponent } from './manage-country.component';

describe('ManageCountryComponent', () => {
  let component: ManageCountryComponent;
  let fixture: ComponentFixture<ManageCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

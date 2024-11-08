import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserGroupComponent } from './manage-user-group.component';

describe('ManageUserGroupComponent', () => {
  let component: ManageUserGroupComponent;
  let fixture: ComponentFixture<ManageUserGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

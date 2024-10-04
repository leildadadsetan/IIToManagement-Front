import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionPresentationComponent } from './user-permission-presentation.component';

describe('UserPermissionPresentationComponent', () => {
  let component: UserPermissionPresentationComponent;
  let fixture: ComponentFixture<UserPermissionPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissionPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

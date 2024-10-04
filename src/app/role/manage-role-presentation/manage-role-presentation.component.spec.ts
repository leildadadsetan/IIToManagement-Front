import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRolePresentationComponent } from './manage-role-presentation.component';

describe('ManageRolePresentationComponent', () => {
  let component: ManageRolePresentationComponent;
  let fixture: ComponentFixture<ManageRolePresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRolePresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRolePresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

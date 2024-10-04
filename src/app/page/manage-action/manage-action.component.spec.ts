import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActionComponent } from './manage-action.component';

describe('ManageActionComponent', () => {
  let component: ManageActionComponent;
  let fixture: ComponentFixture<ManageActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

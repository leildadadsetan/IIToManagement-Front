import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupCategoryComponent } from './manage-group-category.component';

describe('ManageGroupCategoryComponent', () => {
  let component: ManageGroupCategoryComponent;
  let fixture: ComponentFixture<ManageGroupCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

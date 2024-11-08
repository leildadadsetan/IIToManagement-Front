import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCategoryListComponent } from './group-category-list.component';

describe('GroupCategoryListComponent', () => {
  let component: GroupCategoryListComponent;
  let fixture: ComponentFixture<GroupCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

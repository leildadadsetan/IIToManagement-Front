import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCategoryListPresentationComponent } from './group-category-list-presentation.component';

describe('GroupCategoryListPresentationComponent', () => {
  let component: GroupCategoryListPresentationComponent;
  let fixture: ComponentFixture<GroupCategoryListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCategoryListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCategoryListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

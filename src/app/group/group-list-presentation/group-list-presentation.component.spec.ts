import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListPresentationComponent } from './group-list-presentation.component';

describe('GroupListPresentationComponent', () => {
  let component: GroupListPresentationComponent;
  let fixture: ComponentFixture<GroupListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListPresentationComponent } from './page-list-presentation.component';

describe('PageListPresentationComponent', () => {
  let component: PageListPresentationComponent;
  let fixture: ComponentFixture<PageListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

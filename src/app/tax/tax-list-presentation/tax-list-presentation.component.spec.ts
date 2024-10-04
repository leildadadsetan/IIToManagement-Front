import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxListPresentationComponent } from './tax-list-presentation.component';

describe('TaxListPresentationComponent', () => {
  let component: TaxListPresentationComponent;
  let fixture: ComponentFixture<TaxListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

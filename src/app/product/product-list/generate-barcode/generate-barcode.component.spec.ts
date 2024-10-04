import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBarcodeComponent } from './generate-barcode.component';

describe('GenerateBarcodeComponent', () => {
  let component: GenerateBarcodeComponent;
  let fixture: ComponentFixture<GenerateBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateBarcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

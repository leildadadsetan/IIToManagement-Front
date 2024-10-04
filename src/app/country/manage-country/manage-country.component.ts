import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Country } from '@core/domain-classes/country';
import { CountryService } from '@core/services/country.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-manage-country',
  templateUrl: './manage-country.component.html',
  styleUrls: ['./manage-country.component.scss']
})
export class ManageCountryComponent extends BaseComponent implements OnInit {

  isEdit: boolean = false;
  countryForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManageCountryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Country,
    private countryService: CountryService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService) {
    super(translationService);
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.countryForm.patchValue(this.data);
      this.isEdit = true;
    }

  }

  createForm() {
    this.countryForm = this.fb.group({
      id: [''],
      countryName: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveCountry(): void {
    if (!this.countryForm.valid) {
      this.countryForm.markAllAsTouched();
      return;
    }
    const country: Country = this.countryForm.value;
    if (this.data.id) {
      this.countryService.update(country).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('COUNTRY_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.countryService.add(country).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('COUNTRY_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}

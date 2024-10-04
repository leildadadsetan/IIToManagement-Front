import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { City } from '@core/domain-classes/city';
import { Country } from '@core/domain-classes/country';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { CityService } from '../city.service';

@Component({
  selector: 'app-manage-city',
  templateUrl: './manage-city.component.html',
  styleUrls: ['./manage-city.component.scss']
})
export class ManageCityComponent extends BaseComponent implements OnInit {

  isEdit: boolean = false;
  cityForm: UntypedFormGroup;
  countryList: Country[] = [];
  constructor(
    public dialogRef: MatDialogRef<ManageCityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: City,
    private cityService: CityService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    private commonService: CommonService,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createForm();
    this.getCountries()
    if (this.data.id) {
      this.cityForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.cityForm = this.fb.group({
      id: [''],
      cityName: ['',Validators.required],
      countryId: ['',Validators.required]
    });
  }

  getCountries() {
    this.sub$.sink = this.commonService.getCountry().subscribe(c => this.countryList = c);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveCity(): void {
    if (!this.cityForm.valid) {
      this.cityForm.markAllAsTouched();
      return;
    }
    const city: City = this.cityForm.value;
    if (this.data.id) {
      this.cityService.updateCity(city.id, city).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('CITY_SAVED_SUCCESSFULLY'));
        this.dialogRef.close(city);
      });
    } else {
      this.cityService.saveCity(city).subscribe((c) => {
        this.toastrService.success(this.translationService.getValue('CITY_SAVED_SUCCESSFULLY'));
        this.dialogRef.close(city);
      });
    }
  }
}

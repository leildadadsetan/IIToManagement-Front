import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { BaseComponent } from 'src/app/base.component';
import { SupplierService } from '../supplier.service';
import { CommonService } from '@core/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Supplier } from '@core/domain-classes/supplier';
import { Country } from '@core/domain-classes/country';
import { City } from '@core/domain-classes/city';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@environments/environment';
import { TranslationService } from '@core/services/translation.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Location } from '@angular/common';
import { EditorConfig } from '@shared/editor.config';

export class AlreadyExistValidator {
  static exist(flag: boolean): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (flag) {
        return { exist: true };
      }
      return null;
    };
  }
}

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss'],
})
export class SupplierDetailComponent extends BaseComponent implements OnInit {
  supplierForm: UntypedFormGroup;
  titlePage: string = 'Add Supplier';
  imgSrc: any = null;
  isImageUpload: boolean = false;
  supplier: Supplier;
  countries: Country[] = [];
  cities: City[] = [];
  isLoadingCity: boolean = false;
  isLoading = false;

  public filterCityObservable$: Subject<string> = new Subject<string>();

  editorConfig = EditorConfig;

  constructor(
    private fb: UntypedFormBuilder,
    private supplierService: SupplierService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    public translationService: TranslationService,
    private location: Location
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createSupplierForm();
    this.getCountry();
    this.getCityByName();
    const routeSub$ = this.route.data.subscribe(
      (data: { supplier: Supplier }) => {
        if (data.supplier) {
          this.supplier = { ...data.supplier };
          this.titlePage = this.translationService.getValue('MANAGE_SUPPLIER');
          this.patchSupplier();
          if (this.supplier.imageUrl) {
            this.imgSrc = `${environment.apiUrl}${this.supplier.imageUrl}`;
          }
        } else {
          this.titlePage = this.translationService.getValue('MANAGE_SUPPLIER');
          if (this.supplier) {
            this.imgSrc = '';
            this.supplier = Object.assign({}, null);
          }
        }
      }
    );
    this.sub$.add(routeSub$);
  }

  getCityByName() {
    this.isLoadingCity = true;
    this.sub$.sink = this.filterCityObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((c: string) => {
          var strArray = c.split(':');
          return this.commonService.getCityByName(strArray[0], strArray[1]);
        })
      )
      .subscribe(
        (c: City[]) => {
          this.cities = [...c];
          this.isLoadingCity = false;
        },
        (err) => (this.isLoadingCity = false)
      );
  }

  patchSupplier() {
    this.supplierForm.patchValue({
      supplierName: this.supplier.supplierName,
      contactPerson: this.supplier.contactPerson,
      mobileNo: this.supplier.mobileNo,
      phoneNo: this.supplier.phoneNo,
      email: this.supplier.email,
      description: this.supplier.description,
      website: this.supplier.website,
      isVarified: this.supplier.isVarified,
      url: this.supplier.url,
      supplierProfiler: this.supplier.supplierProfile,
      supplierAddress: this.supplier.supplierAddress,
      billingAddress: this.supplier.billingAddress,
      shippingAddress: this.supplier.shippingAddress
    });
  }

  createSupplierForm() {
    this.supplierForm = this.fb.group({
      supplierName: ['', [Validators.required, Validators.maxLength(500)]],
      contactPerson: [''],
      mobileNo: [''],
      phoneNo: '',
      website: [''],
      description: [''],
      email: ['', [Validators.required, Validators.email]],
      supplierAddress: this.fb.group({
        id: [''],
        address: ['', [Validators.required]],
        countryName: ['', [Validators.required]],
        cityName: ['', [Validators.required]],
      }),
      billingAddress: this.fb.group({
        id: [''],
        address: ['', [Validators.required]],
        countryName: ['', [Validators.required]],
        cityName: ['', [Validators.required]],
      }),
      shippingAddress: this.fb.group({
        id: [''],
        address: ['', [Validators.required]],
        countryName: ['', [Validators.required]],
        cityName: ['', [Validators.required]],
      })
    });
  }

  onSameAsAddress(event: MatCheckboxChange) {
    if (event.checked) {
      this.supplierForm.get('billingAddress').patchValue(this.supplierForm.get('supplierAddress').value);
    } else {
      this.supplierForm.get('billingAddress').reset();
    }
  }

  onSameAsBillingAddress(event: MatCheckboxChange) {
    if (event.checked) {
      this.supplierForm.get('shippingAddress').patchValue(this.supplierForm.get('billingAddress').value);
    } else {
      this.supplierForm.get('shippingAddress').reset();
    }
  }

  onFileSelect($event) {
    const fileSelected = $event.target.files[0];
    if (!fileSelected) {
      return;
    }
    const mimeType = fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    // tslint:disable-next-line: variable-name
    reader.onload = (_event) => {
      this.imgSrc = reader.result;
      this.isImageUpload = true;
      $event.target.value = '';
    }
  }

  onRemoveImage() {
    this.isImageUpload = true;
    this.imgSrc = '';
  }

  getCountry() {
    const CountrySub$ = this.commonService.getCountry().subscribe((data) => {
      this.countries = data;
    });
    this.sub$.add(CountrySub$);
  }

  handleFilterCity(cityName: string, formGroup: string) {
    cityName = this.supplierForm.get(formGroup).get('cityName').value
    const country = this.supplierForm.get(formGroup).get('countryName').value;
    if (cityName && country) {
      const strCountryCity = country + ':' + cityName;
      this.filterCityObservable$.next(strCountryCity);
    }
  }

  onCountryChange(country, formGroup: string) {
    this.supplierForm.get(formGroup).patchValue({
      cityName: '',
    });
    if (country.value) {
      const strCountry = country.value + ':' + '';
      this.filterCityObservable$.next(strCountry);
    } else {
      this.cities = [];
    }
  }

  onSupplierList() {
    this.location.back();
  }

  onSupplierSubmit() {
    if (this.supplierForm.valid) {
      let supObj: Supplier = this.createBuildForm();
      supObj.logo = this.imgSrc;
      supObj.isImageUpload = this.isImageUpload;

      if (!supObj.billingAddress || !supObj.billingAddress.address) {
        supObj.billingAddress = null;
      }

      if (!supObj.shippingAddress || !supObj.shippingAddress.address) {
        supObj.shippingAddress = null;
      }

      if (this.supplier) {
        this.isLoading = true;
        this.sub$.sink = this.supplierService
          .updateSupplier(this.supplier.id, supObj)
          .subscribe((c) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('SUPPLIER_UPDATE_SUCCESSFULLY'));
            this.router.navigate(['/supplier']);
          }, () => this.isLoading = false);
      } else {
        this.isLoading = true;
        this.sub$.sink = this.supplierService
          .saveSupplier(supObj)
          .subscribe((c) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('SUPPLIER_SAVE_SUCCESSFULLY'));
            this.router.navigate(['/supplier']);
          }, () => this.isLoading = false);
      }
    } else {
      this.markFormGroupTouched(this.supplierForm);
    }
  }

  private markFormGroupTouched(formGroup: UntypedFormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createBuildForm(): Supplier {
    const supplierObj: Supplier = {
      id: this.supplier ? this.supplier.id : null,
      supplierName: this.supplierForm.get('supplierName').value,
      contactPerson: this.supplierForm.get('contactPerson').value,
      mobileNo: this.supplierForm.get('mobileNo').value,
      phoneNo: this.supplierForm.get('phoneNo').value,
      website: this.supplierForm.get('website').value,
      description: this.supplierForm.get('description').value,
      email: this.supplierForm.get('email').value,
      url: '',
      isVarified: true,
      isUnsubscribe: false,
      supplierProfile: '',
      supplierAddress: this.supplierForm.get('supplierAddress').value,
      billingAddress: this.supplierForm.get('billingAddress').value,
      shippingAddress: this.supplierForm.get('shippingAddress').value
    };
    return supplierObj;
  }
}

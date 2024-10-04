import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { City } from '@core/domain-classes/city';
import { Location } from '@angular/common';
import { Country } from '@core/domain-classes/country';
import { Customer } from '@core/domain-classes/customer';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { CustomerService } from '../customer.service';
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
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent extends BaseComponent implements OnInit {

  customerForm: UntypedFormGroup;
  imgSrc: any = null;
  isImageUpload: boolean = false;
  customer: Customer;
  countries: Country[] = [];
  cities: City[] = [];
  isLoadingCity: boolean = false;
  editorConfig = EditorConfig;
  public filterCityObservable$: Subject<string> = new Subject<string>();

  constructor(
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
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
    this.createCustomerForm();
    this.getCountry();
    this.getCityByName();
    const routeSub$ = this.route.data.subscribe(
      (data: { customer: Customer }) => {
        if (data.customer) {
          this.customer = { ...data.customer };
          if (this.customer.imageUrl) {
            this.imgSrc = `${environment.apiUrl}${this.customer.imageUrl}`;
          }
          this.patchCustomer();
        } else {
          if (this.customer) {
            this.imgSrc = '';
            this.customer = Object.assign({}, null);
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

  patchCustomer() {
    this.customerForm.patchValue({
      customerName: this.customer.customerName,
      contactPerson: this.customer.contactPerson,
      mobileNo: this.customer.mobileNo,
      phoneNo: this.customer.phoneNo,
      description: this.customer.description,
      website: this.customer.website,
      isVarified: this.customer.isVarified,
      url: this.customer.url,
      address: this.customer.address,
      email: this.customer.email,
      countryId: this.customer.countryId,
      cityName: this.customer.cityName,
      countryName: this.customer.countryName
    });
  }

  createCustomerForm() {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(500)]],
      contactPerson: [''],
      mobileNo: ['', [Validators.required]],
      phoneNo: '',
      website: [''],
      description: [''],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      cityId: [''],
      countryId: [''],
      cityName: [''],
      countryName: ['']
    });
  }

  onEmailChange(event: any) {
    const email = this.customerForm.get('email').value;
    if (!email) {
      return;
    }
    const id =
      this.customer && this.customer.id ? this.customer.id : Guid.create();
    this.sub$.sink = this.customerService
      .checkEmailOrPhoneExist('', email, id)
      .subscribe((c) => {
        const emailControl = this.customerForm.get('email');
        if (c) {
          emailControl.setValidators([
            Validators.required,
            AlreadyExistValidator.exist(true),
          ]);
        } else {
          emailControl.setValidators([Validators.required]);
        }
        emailControl.updateValueAndValidity();
      });
  }

  onMobileNoChange(event: any) {
    const mobileno = this.customerForm.get('mobileNo').value;
    if (!mobileno) {
      return;
    }
    const id =
      this.customer && this.customer.id ? this.customer.id : Guid.create();
    this.sub$.sink = this.customerService
      .checkEmailOrPhoneExist('', mobileno, id)
      .subscribe((c) => {
        const mobileNoControl = this.customerForm.get('mobileNo');
        if (c) {
          mobileNoControl.setValidators([
            Validators.required,
            AlreadyExistValidator.exist(true),
          ]);
        } else {
          mobileNoControl.setValidators([Validators.required]);
        }
        mobileNoControl.updateValueAndValidity();
      });
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
    this.imgSrc = '';
    this.isImageUpload = true;
  }

  getCountry() {
    const CountrySub$ = this.commonService.getCountry().subscribe((data) => {
      this.countries = data;
    });
    this.sub$.add(CountrySub$);
  }

  handleFilterCity(cityName: string) {
    const country = this.customerForm.get('countryName').value;
    if (cityName && country) {
      const strCountryCity = country + ':' + cityName;
      this.filterCityObservable$.next(strCountryCity);
    }
  }

  onCountryChange(country: any) {
    this.customerForm.patchValue({
      cityName: '',
    });
    if (country.value) {
      const strCountry = country.value + ':' + '';
      this.filterCityObservable$.next(strCountry);
    } else {
      this.cities = [];
    }
  }

  onCustomerList() {
    this.location.back();
  }

  onCustomerSubmit() {
    if (this.customerForm.valid) {
      const custObj = this.createBuildForm();
      custObj.logo = this.imgSrc;
      custObj.isImageUpload = this.isImageUpload;
      if (this.customer) {
        this.sub$.sink = this.customerService
          .updateCustomer(this.customer.id, custObj)
          .subscribe(c => {
            this.toastrService.success(this.translationService.getValue('CUSTOMER_UPDATE_SUCCESSFULLY'));
            this.router.navigate(['/customer']);
          });
      } else {
        this.sub$.sink = this.customerService
          .saveCustomer(custObj)
          .subscribe(c => {
            this.toastrService.success(this.translationService.getValue('CUSTOMER_SAVE_SUCCESSFULLY'));
            this.router.navigate(['/customer']);
          });
      }
    } else {
      this.markFormGroupTouched(this.customerForm);
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

  createBuildForm(): Customer {
    const customerObj: Customer = {
      id: this.customer ? this.customer.id : null,
      customerName: this.customerForm.get('customerName').value,
      contactPerson: this.customerForm.get('contactPerson').value,
      mobileNo: this.customerForm.get('mobileNo').value,
      phoneNo: this.customerForm.get('phoneNo').value,
      website: this.customerForm.get('website').value,
      description: this.customerForm.get('description').value,
      url: '',
      isVarified: true,
      isUnsubscribe: false,
      address: this.customerForm.get('address').value,
      email: this.customerForm.get('email').value,
      countryId: this.customerForm.get('countryId').value,
      cityId: this.customerForm.get('cityId').value,
      cityName: this.customerForm.get('cityName').value,
      countryName: this.customerForm.get('countryName').value,
    };
    return customerObj;
  }

}

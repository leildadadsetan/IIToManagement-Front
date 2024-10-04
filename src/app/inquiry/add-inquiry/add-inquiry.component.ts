import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { City } from '@core/domain-classes/city';
import { Country } from '@core/domain-classes/country';
import { Inquiry } from '@core/domain-classes/inquiry';
import { InquiryProduct } from '@core/domain-classes/inquiry-product';
import { InquirySource } from '@core/domain-classes/inquiry-source';
import { InquiryStatus } from '@core/domain-classes/inquiry-status';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { CommonService } from '@core/services/common.service';
import { InquirySourceService } from '@core/services/inquiry-source.service';
import { InquiryStatusService } from '@core/services/inquiry-status.service';
import { TranslationService } from '@core/services/translation.service';
import { EditorConfig } from '@shared/editor.config';
import { ValidateUrl } from '@shared/validators/url-validation';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ProductService } from 'src/app/product/product.service';
import { UserService } from 'src/app/user/user.service';
import { InquiryService } from '../inquiry.service';

export function emailOrMobileValidator(): ValidatorFn {
  return (form: UntypedFormGroup): ValidationErrors | null => {
    const email: string = form.get("email").value;
    const mobileNo: string = form.get("mobileNo").value;
    if (email || mobileNo) {
      return null;
    }
    return { mobileoremail: true };
  }
}

@Component({
  selector: 'app-add-inquiry',
  templateUrl: './add-inquiry.component.html',
  styleUrls: ['./add-inquiry.component.scss']
})
export class AddInquiryComponent extends BaseComponent implements OnInit {
  inquiryForm: UntypedFormGroup;
  products: Product[] = [];
  inquiry: Inquiry;
  countries: Country[] = [];
  cities: City[] = [];
  isLoading = false;
  public filterObservable$: Subject<string> = new Subject<string>();
  public filterCityObservable$: Subject<string> = new Subject<string>();
  editorConfig = EditorConfig;
  inquiryStatuses: InquiryStatus[] = [];
  userResource: UserResource;
  users: User[] = [];
  sourcesOfInquiry: InquirySource[] = [];
  productResource: ProductResourceParameter;

  get inquieryProductArray(): UntypedFormArray {
    return <UntypedFormArray>this.inquiryForm.get('inquiryProducts');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private inquiryService: InquiryService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private productService: ProductService,
    private userService: UserService,
    public translationService: TranslationService,
    private inquiryStatusService: InquiryStatusService,
    private inquirySourceService: InquirySourceService
  ) {
    super(translationService);
    this.getLangDir();
    this.userResource = new UserResource();
    this.userResource.pageSize = 10;
    this.userResource.orderBy = 'firstName desc';
    this.productResource = new ProductResourceParameter();
  }

  ngOnInit(): void {
    this.createInquiryForm();
    this.getCountry();
    this.getCityByName();
    this.getInuiriesStatus();
    this.getInquirySource()
    this.getUsers();
    this.getDefaultProducts();
    this.inquiry = null;

    this.inquiryForm.get('productNameInput').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.productResource.name = c ?? '';
          return this.productService.getProducts(this.productResource);
        })
      ).subscribe((resp: HttpResponse<Product[]>) => {
        if (resp && resp.headers) {
          this.products = [...resp.body];
        }
      }, (err) => {
      });
  }

  getDefaultProducts() {
    this.productResource.name = '';
    this.productService.getProducts(this.productResource)
      .subscribe(c => {
        this.products = [...c.body];
      });
  }

  getUsers() {
    this.sub$.sink = this.userService.getUsers(this.userResource)
      .subscribe((resp: HttpResponse<User[]>) => {
        this.users = resp.body;
      });
  }

  getCityByName() {
    this.sub$.sink = this.filterCityObservable$
      .pipe(
        debounceTime(1000),
        tap(() => this.isLoading = true),
        distinctUntilChanged(),
        switchMap((c: string) => {
          if (c) {
            var strArray = c.split(':');
            return this.commonService.getCityByName(strArray[0], strArray[1]).pipe(tap(() => { this.isLoading = false }));
          } else {
            return of(null);
          }
        }), finalize(() => { this.isLoading = false })
      )
      .subscribe(
        (c: City[]) => {
          this.cities = [...c];
          this.isLoading = false;
        },
        (err) => (this.isLoading = false)
      );
  }

  patchInquiry() {
    this.inquiryForm.patchValue({
      companyName: this.inquiry.companyName,
      contactPerson: this.inquiry.contactPerson,
      email: this.inquiry.email,
      mobileNo: this.inquiry.mobileNo,
      phoneNo: this.inquiry.phone,
      description: this.inquiry.description,
      website: this.inquiry.website,
      address: this.inquiry.address,
      cityName: this.inquiry.cityName,
      countryName: this.inquiry.countryName,
      inquiryProducts: this.inquiry.inquiryProducts,
      message: this.inquiry.message,
      inquirySourceId: this.inquiry.inquirySourceId,
      assignTo: this.inquiry.assignTo,
      inquiryStatusId: this.inquiry.inquiryStatusId
    });
    if (this.inquiry.countryName && this.inquiry.cityName) {
      const strCountryCity =
        this.inquiry.countryName + ':' + this.inquiry.cityName;
      this.filterCityObservable$.next(strCountryCity);
    }
  }

  createInquiryForm() {
    this.inquiryForm = this.fb.group({
      id: [''],
      productNameInput: [''],
      productId: [''],
      inquiryProducts: this.fb.array([]),
      companyName: ['', [Validators.required, Validators.maxLength(500)]],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.email]],
      mobileNo: [''],
      phoneNo: [''],
      website: ['', [ValidateUrl]],
      address: [''],
      cityName: [''],
      countryName: [''],
      message: [''],
      inquirySourceId: ['', [Validators.required]],
      inquiryStatusId: [null, [Validators.required]],
      assignTo: [null]
    }, {
      validators: [emailOrMobileValidator()]
    });
  }

  getCountry() {
    this.sub$.sink = this.commonService.getCountry().subscribe((data) => {
      this.countries = data;
    });
  }

  getInuiriesStatus() {
    this.sub$.sink = this.inquiryStatusService.getAll()
      .subscribe(c => {
        this.inquiryStatuses = c;
      })
  }

  getInquirySource() {
    this.inquirySourceService.getAll()
      .subscribe(c => this.sourcesOfInquiry = c);
  }

  handleFilterCity(cityName: string) {
    cityName = this.inquiryForm.get('cityName').value
    const country = this.inquiryForm.get('countryName').value;
    if (cityName && country) {
      const strCountryCity = country + ':' + cityName;
      this.filterCityObservable$.next(strCountryCity);
    }
  }
  onCountryChange(country: string) {
    this.inquiryForm.patchValue({
      cityName: '',
    });

    if (country) {
      const strCountry = country + ':' + '';
      this.filterCityObservable$.next(strCountry);
    } else {
      this.cities = [];
    }
  }
  onInquiryList() {
    this.router.navigate(['/inquiry']);
  }

  onInquirySubmit() {
    if (this.inquieryProductArray.length == 0) {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_ATLEST_ONE_PRODUCT.'));
      return;
    }
    if (this.inquiryForm.valid) {
      this.isLoading = true;
      const inqObj = this.createBuildForm();
      if (this.inquiry) {
        this.sub$.sink = this.inquiryService
          .updateInquiry(this.inquiry.id, inqObj)
          .subscribe((c) => {
            this.toastrService.success(this.translationService.getValue('INQUIRY_UPDATE_SUCCESSFULLY'));
            this.router.navigate(['/inquiry']);
          }, () => { this.isLoading = false; });
      } else {
        this.sub$.sink = this.inquiryService
          .saveInquiry(inqObj)
          .subscribe((c) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('INQUIRY_SAVE_SUCCESSFULLY'));
            this.router.navigate(['/inquiry']);
          }, () => { this.isLoading = false; });
      }
    } else {
      this.inquiryForm.markAllAsTouched();
      // this.markFormGroupTouched(this.inquiryForm);
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

  createBuildForm(): Inquiry {
    const inquiryObj: Inquiry = {
      id: this.inquiry ? this.inquiry.id : null,
      companyName: this.inquiryForm.get('companyName').value,
      contactPerson: this.inquiryForm.get('contactPerson').value,
      email: this.inquiryForm.get('email').value,
      mobileNo: this.inquiryForm.get('mobileNo').value,
      phone: this.inquiryForm.get('phoneNo').value,
      website: this.inquiryForm.get('website').value,
      message: this.inquiryForm.get('message').value,
      countryName: this.inquiryForm.get('countryName').value,
      cityName: this.inquiryForm.get('cityName').value,
      address: this.inquiryForm.get('address').value,
      inquiryProducts: this.inquiryForm.get('inquiryProducts').value,
      inquirySourceId: this.inquiryForm.get('inquirySourceId').value,
      inquiryStatusId: this.inquiryForm.get('inquiryStatusId').value,
      assignTo: this.inquiryForm.get('assignTo').value
    };
    return inquiryObj;
  }

  editInquiryProduct(product: InquiryProduct): UntypedFormGroup {
    return this.fb.group({
      productId: [product.productId],
      name: [product.name],
      inquiryId: [product.inquiryId]
    });
  }

  pushValuesInquiryProduct() {
    if (this.inquiry.inquiryProducts && this.inquiry.inquiryProducts.length > 0) {
      this.inquiry.inquiryProducts.map(product => {
        this.inquieryProductArray.push(this.editInquiryProduct(product));
      })
    }
  }

  selectProduct() {
    const product = this.products.find(c => c.id === this.inquiryForm.get('productId').value);
    if (product) {
      this.inquieryProductArray.push(this.editInquiryProduct({
        productId: product.id,
        inquiryId: this.inquiry ? this.inquiry.id : '',
        name: product.name
      }));
      this.inquiryForm.get('productNameInput').setValue(null);
      this.inquiryForm.get('productId').setValue('');
    }
  };

  removeProduct(index: number) {
    this.inquieryProductArray.removeAt(index)
  }
}

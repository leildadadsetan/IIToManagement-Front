import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from '@core/domain-classes/brand';
import { Product } from '@core/domain-classes/product';
import { ProductCategory } from '@core/domain-classes/product-category';
import { Tax } from '@core/domain-classes/tax';
import { Unit } from '@core/domain-classes/unit';
import { Warehouse } from '@core/domain-classes/warehouse';
import { BrandService } from '@core/services/brand.service';
import { ProductCategoryService } from '@core/services/product-category.service';
import { TaxService } from '@core/services/tax.service';
import { TranslationService } from '@core/services/translation.service';
import { UnitService } from '@core/services/unit.service';
import { WarehouseService } from '@core/services/warehouse.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { UnitConversationService } from 'src/app/unit-conversation/unit-conversation.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent extends BaseComponent implements OnInit {
  productForm: UntypedFormGroup;
  units: Unit[] = [];
  productCategories: ProductCategory[] = [];
  allCategories: ProductCategory[] = [];
  taxes: Tax[] = [];
  brands: Brand[] = [];
  warehouses: Warehouse[] = [];
  isLoading = false;
  productImgSrc: any = null;
  isProductImageUpload = false;
  qrCodeImgSrc: any = null;
  isQrCodeUpload = false;
  constructor(
    private fb: UntypedFormBuilder,
    private unitService: UnitConversationService,
    private productCategoryService: ProductCategoryService,
    private taxService: TaxService,
    private productService: ProductService,
    private brandService: BrandService,
    private warehouseService: WarehouseService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createProductForm();

    this.getUnits();
    this.getProductCategories();
    this.getTaxes();
    this.getBrands();
    this.getWarehouse();
    this.activatedRoute.data.subscribe((data: { product: Product }) => {
      if (data && data.product) {
        this.productForm.patchValue(data.product);
        if (data.product.productUrl) {
          this.productImgSrc = `${environment.apiUrl}${data.product.productUrl}`;
        }
        if (data.product.qrCodeUrl) {
          this.qrCodeImgSrc = `${environment.apiUrl}${data.product.qrCodeUrl}`;
        }
        const productTaxIds = data.product.productTaxes.map(c => c.taxId);
        this.productForm.get('productTaxIds').patchValue(productTaxIds);
      }
    });
  }

  createProductForm() {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      brandId: ['', [Validators.required]],
      code: [''],
      barcode: [''],
      skuCode: [''],
      skuName: [''],
      description: [''],
      productTaxIds: [],
      productUrlData: [],
      qRCodeUrlData: [''],
      unitId: ['', [Validators.required]],
      purchasePrice: [],
      salesPrice: [],
      mrp: [],
      categoryId: ['', [Validators.required]],
      warehouseId: [''],
    });
  }

  getUnits() {
    this.unitService.getAllBaseUnit().subscribe(units => {
      this.units = units;
    })
  }

  getWarehouse() {
    this.warehouseService.getAll().subscribe(warehouses => {
      this.warehouses = warehouses;
    })
  }
  getProductCategories() {
    this.productCategoryService.getAllCategoriesForDropDown().subscribe(c => {
      this.productCategories = [...c];
      this.setDeafLevel();
    });
  }

  setDeafLevel(parent?: ProductCategory, parentId?: string) {
    const children = this.productCategories.filter(c => c.parentId == parentId);
    if (children.length > 0) {
      children.map((c, index) => {
        const object: ProductCategory = Object.assign({}, c, {
          deafLevel: parent ? parent.deafLevel + 1 : 0,
          index: (parent ? parent.index : 0) + index * Math.pow(0.1, c.deafLevel)
        })
        this.allCategories.push(object);
        this.setDeafLevel(object, object.id);
      });
    }
    return parent;
  }

  getTaxes() {
    this.taxService.getAll().subscribe(c => this.taxes = c);
  }

  getBrands() {
    this.brandService.getAll().subscribe(b => this.brands = b);
  }

  onProductSubmit() {
    if (this.productForm.valid) {
      let product: Product = this.productForm.value;
      const taxIds: string[] = this.productForm.get('productTaxIds').value;
      if (taxIds) {
        product.productTaxes = taxIds.map(c => {
          return {
            taxId: c,
            productId: product.id
          }
        });
      }
      product.isProductImageUpload = this.isProductImageUpload;
      product.isQrCodeUpload = this.isQrCodeUpload;
      product.productUrlData = this.productImgSrc;
      product.qRCodeUrlData = this.qrCodeImgSrc;
      if (!product.id) {
        this.isLoading = true;
        this.productService
          .addProudct(product)
          .subscribe((c) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('PRODUCT_SAVED_SUCCESSFULLY'));
            this.router.navigate(['/products']);
          }, () => this.isLoading = false);
      } else {
        this.isLoading = true;
        this.productService
          .updateProudct(product.id, product)
          .subscribe((c) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('PRODUCT_SAVED_SUCCESSFULLY'));
            this.router.navigate(['/products']);
          }, () => this.isLoading = false);
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onProductImageSelect($event) {
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
      this.productImgSrc = reader.result;
      this.isProductImageUpload = true;
      $event.target.value = '';
    }
  }

  onProductImageRemove() {
    this.isProductImageUpload = true;
    this.productImgSrc = '';
  }

  onQRCodeSelect($event) {
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
      this.qrCodeImgSrc = reader.result;
      this.isQrCodeUpload = true;
      $event.target.value = '';
    }
  }

  onQRCodeRemove() {
    this.isQrCodeUpload = true;
    this.qrCodeImgSrc = '';
  }

}

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DeliveryStatusEnum } from '@core/domain-classes/delivery-status-enum';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order-item';
import { PurchaseOrderItemTax } from '@core/domain-classes/purchase-order-item-tax';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { PurchaseOrderStatusEnum } from '@core/domain-classes/purchase-order-status';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { Tax } from '@core/domain-classes/tax';
import { Unit } from '@core/domain-classes/unit';
import { CommonService } from '@core/services/common.service';
import { TaxService } from '@core/services/tax.service';
import { TranslationService } from '@core/services/translation.service';
import { QuantitiesUnitPriceTaxPipe } from '@shared/pipes/quantities-unitprice-tax.pipe';
import { QuantitiesUnitPricePipe } from '@shared/pipes/quantities-unitprice.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ProductService } from 'src/app/product/product.service';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { Location } from '@angular/common';
import { ClonerService } from '@core/services/clone.service';
import { Warehouse } from '@core/domain-classes/warehouse';

@Component({
  selector: 'app-purchase-order-return',
  templateUrl: './purchase-order-return.component.html',
  styleUrls: ['./purchase-order-return.component.scss'],
  viewProviders: [QuantitiesUnitPricePipe, QuantitiesUnitPriceTaxPipe]
})
export class PurchaseOrderReturnComponent extends BaseComponent {
  taxes$: Observable<Tax[]>;
  purchaseOrderForm: UntypedFormGroup;
  purchaseOrderReturnForm: UntypedFormGroup;
  products: Product[] = [];
  suppliers: Supplier[] = [];
  suppliersForSearch: Supplier[] = [];
  supplierResource: SupplierResourceParameter;
  purchaseResouce: PurchaseOrderResourceParameter;
  productResource: ProductResourceParameter;
  purchaseorders: PurchaseOrder[] = [];
  isLoading: boolean = false;
  isSupplierLoading: boolean = false;
  filterProductsMap: { [key: string]: Product[] } = {};
  warehouseMap: { [key: string]: Warehouse[] } = {};
  unitsMap: { [key: string]: Unit[] } = {};
  taxsMap: { [key: string]: Tax[] } = {};
  totalBeforeDiscount: number = 0;
  totalAfterDiscount: number = 0;
  totalDiscount: number = 0;
  grandTotal: number = 0;
  totalTax: number = 0;
  timeoutclear: any;
  purchaseOrder: PurchaseOrder;
  isEdit: boolean = false;
  purchaseOrderRequestList: PurchaseOrder[] = [];
  purchaseOrderResource: PurchaseOrderResourceParameter;


  get purchaseOrderItemsArray(): UntypedFormArray {
    return <UntypedFormArray>this.purchaseOrderForm.get('purchaseOrderItems');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private supplierService: SupplierService,
    private toastrService: ToastrService,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    public translationService: TranslationService,
    private commonService: CommonService,
    private taxService: TaxService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private quantitiesUnitPricePipe: QuantitiesUnitPricePipe,
    private quantitiesUnitPriceTaxPipe: QuantitiesUnitPriceTaxPipe,
    private location: Location,
    private cloneService: ClonerService
  ) {
    super(translationService);
    this.getLangDir();
    this.supplierResource = new SupplierResourceParameter();
    this.purchaseResouce = new PurchaseOrderResourceParameter();
    this.productResource = new ProductResourceParameter();
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 50;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc';
    this.purchaseOrderResource.isPurchaseOrderRequest = true;
  }

  ngOnInit(): void {
    this.createPurchaseOrder();
    this.getTaxes();
  }

  onFilterValue(filterValue: any) {
    console.log(filterValue);
  }

  getTaxes() {
    this.taxes$ = this.taxService.entities$;
  }

  createPurchaseOrderReturnOrder() {
    this.purchaseOrderReturnForm = this.fb.group({
      orderNumber: [''],
      filerSupplier: [''],
      supplierId: [''],
      purchaseOrderId: [''],
      filerPurchaseOrder: ['']
    });
    this.getSuppliers();
    this.supplierNameForSearchChangeValue();
    this.subscribeSupplierChangeEvent();
    this.subscribePurchaseOrderFilterChangeEvent();
    this.onPurchaseOrderChange();
  }

  subscribeSupplierChangeEvent() {
    this.purchaseOrderReturnForm.get('supplierId').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.purchaseResouce.supplierId = c;
          this.purchaseResouce.status = PurchaseOrderStatusEnum.Not_Return;
          return this.purchaseOrderService.getAllPurchaseOrder(this.purchaseResouce);
        })
      ).subscribe((resp: HttpResponse<PurchaseOrder[]>) => {
        if (resp && resp.headers) {
          this.purchaseorders = [...resp.body];
        }
      });
  }

  subscribePurchaseOrderFilterChangeEvent() {
    this.purchaseOrderReturnForm.get('filerPurchaseOrder').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.purchaseResouce.orderNumber = c;
          return this.purchaseOrderService.getAllPurchaseOrder(this.purchaseResouce);
        })
      ).subscribe((resp: HttpResponse<PurchaseOrder[]>) => {
        if (resp && resp.headers) {
          this.purchaseorders = [...resp.body];
        }
      });
  }

  clearFormArray() {
    while (this.purchaseOrderItemsArray.length !== 0) {
      this.purchaseOrderItemsArray.removeAt(0)
    }
  }

  onPurchaseOrderChange() {
    this.purchaseOrderReturnForm.get('purchaseOrderId').valueChanges
      .subscribe(id => {
        if (id) {
          this.router.navigate(['/purchase-order-return', id]);
        }
      });
  }


  createPurchaseOrder() {
    this.route.data
      .pipe(
      )
      .subscribe((purchaseOrderData: { 'purchaseorder': PurchaseOrder }) => {
        this.purchaseOrder = purchaseOrderData.purchaseorder;
        if (this.purchaseOrder) {
          this.isEdit = true;
          this.purchaseOrderForm = this.fb.group({
            orderNumber: [{ value: this.purchaseOrder.orderNumber, disabled: false }],
            filerSupplier: [{ value: '', disabled: true }],
            deliveryDate: [{ value: this.purchaseOrder.deliveryDate, disabled: true }, [Validators.required]],
            poCreatedDate: [{ value: this.purchaseOrder.poCreatedDate, disabled: true }, [Validators.required]],
            deliveryStatus: [this.purchaseOrder.deliveryStatus],
            supplierId: [{ value: this.purchaseOrder.supplierId, disabled: true }, [Validators.required]],
            note: [{ value: '', disabled: false }],
            purchaseOrderItems: this.fb.array([])
          });
          this.purchaseOrder.purchaseOrderItems.forEach(c => {
            this.purchaseOrderItemsArray.push(this.createPurchaseOrderItemPatch(this.purchaseOrderItemsArray.length, c));
          });
          this.supplierNameChangeValue();
          this.getSuppliers();
          this.getAllTotal();
        } else {
          this.createPurchaseOrderReturnOrder();
          this.purchaseResouce.pageSize = 10;
          this.purchaseResouce.status = PurchaseOrderStatusEnum.Not_Return;
          this.purchaseOrderService.getAllPurchaseOrder(this.purchaseResouce)
            .subscribe((resp: HttpResponse<PurchaseOrder[]>) => {
              if (resp && resp.headers) {
                this.purchaseorders = [...resp.body];
              }
            })
        }
      });
  }

  onAddAnotherProduct() {
    this.purchaseOrderItemsArray.push(this.createPurchaseOrderItem(this.purchaseOrderItemsArray.length));
  }

  createPurchaseOrderItemPatch(index: number, purchaseOrderItem: PurchaseOrderItem) {
    const taxs = purchaseOrderItem.purchaseOrderItemTaxes.map(c => c.taxId);
    const formGroup = this.fb.group({
      productId: [{ value: purchaseOrderItem.productId, disabled: true }, [Validators.required]],
      filterProductValue: [{ value: '', disabled: true }],
      unitPrice: [{ value: purchaseOrderItem.unitPrice, disabled: true }, [Validators.required]],
      quantity: [{ value: purchaseOrderItem.quantity, disabled: true }, [Validators.required]],
      reurnquntity: [{ value: purchaseOrderItem.quantity, disabled: false }, [Validators.required, Validators.max(purchaseOrderItem.quantity), Validators.min(1)]],
      taxValue: [{ value: taxs, disabled: true }],
      unitId: [{ value: purchaseOrderItem.unitId, disabled: true }, [Validators.required]],
      warehouseId:  [{ value: purchaseOrderItem.warehouseId, disabled: true }],
      discountPercentage: [{ value: purchaseOrderItem.discountPercentage, disabled: true }]
    });
    this.unitsMap[index] = [... this.route.snapshot.data['units']];
    this.taxsMap[index] = [... this.route.snapshot.data['taxs']];
    this.warehouseMap[index] =  [... this.route.snapshot.data['warehouses']];
    this.filterProductsMap[index.toString()] = [purchaseOrderItem.product];
    this.getProductByNameValue(formGroup, index);
    return formGroup;
  }

  createPurchaseOrderItem(index: number) {
    const formGroup = this.fb.group({
      productId: ['', [Validators.required]],
      filterProductValue: [''],
      unitPrice: [0, [Validators.required]],
      quantity: [0, [Validators.required]],
      taxValue: [null],
      unitId: [{ value: null, disabled: true }],
      warehouseId:  [{ value: null, disabled: true }],
      discountPercentage: [0]
    });
    this.unitsMap[index] = [... this.route.snapshot.data['units']];
    this.warehouseMap[index] =  [... this.route.snapshot.data['warehouses']];
    this.taxsMap[index] = [... this.route.snapshot.data['taxs']];
    this.filterProductsMap[index.toString()] = [...this.route.snapshot.data['products']];
    this.getProductByNameValue(formGroup, index);
    return formGroup;
  }

  getProductByNameValue(formGroup: UntypedFormGroup, index: number) {
    if (this.purchaseOrder) {
      this.getProducts(index);
    }
    this.sub$.sink = formGroup.get('filterProductValue').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.productResource.name = c;
          return this.productService.getProducts(this.productResource);
        })
      ).subscribe((resp: HttpResponse<Product[]>) => {
        if (resp && resp.headers) {
          this.filterProductsMap[index.toString()] = [...resp.body];
        }
      }, (err) => {

      });

  }

  getAllTotal() {
    let purchaseOrderItemsArray = this.purchaseOrderForm.get('purchaseOrderItems') as UntypedFormArray;
    let purchaseOrderItems = purchaseOrderItemsArray.getRawValue();
    this.totalBeforeDiscount = 0;
    this.grandTotal = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    if (purchaseOrderItems && purchaseOrderItems.length > 0) {
      purchaseOrderItems.forEach(po => {
        if (po.unitPrice && po.reurnquntity) {
          const totalBeforeDiscount = this.totalBeforeDiscount + parseFloat(this.quantitiesUnitPricePipe.transform(po.reurnquntity, po.unitPrice));
          this.totalBeforeDiscount = parseFloat(totalBeforeDiscount.toFixed(2));
          const gradTotal = this.grandTotal + parseFloat(this.quantitiesUnitPricePipe.transform(po.reurnquntity, po.unitPrice, po.discountPercentage, po.taxValue, this.taxsMap[0]));
          this.grandTotal = parseFloat(gradTotal.toFixed(2));
          const totalTax = this.totalTax + parseFloat(this.quantitiesUnitPriceTaxPipe.transform(po.reurnquntity, po.unitPrice, po.discountPercentage, po.taxValue, this.taxsMap[0]));
          this.totalTax = parseFloat(totalTax.toFixed(2));
          const totalDiscount = this.totalDiscount + parseFloat(this.quantitiesUnitPriceTaxPipe.transform(po.reurnquntity, po.unitPrice, po.discountPercentage));
          this.totalDiscount = parseFloat(totalDiscount.toFixed(2));
        }
      })
    }
  }

  onUnitPriceChange() {
    this.getAllTotal();
  }
  onQuantityChange() {
    this.getAllTotal();
  }
  onDiscountChange() {
    this.getAllTotal();
  }
  onTaxSelectionChange() {
    this.getAllTotal();
  }

  onRemovePurchaseOrderItem(index: number) {
    this.purchaseOrderItemsArray.removeAt(index);
    this.purchaseOrderItemsArray.controls.forEach((c: UntypedFormGroup, index: number) => {
      const productId = c.get('productId').value;
      this.purchaseOrder.purchaseOrderItems.map(pi => {
        if (pi.product.id === productId) {
          this.filterProductsMap[index.toString()] = this.cloneService.deepClone([pi.product]);
        }
      });
    });
    this.getAllTotal();
  }

  getProducts(index: number) {
    if (this.products.length === 0) {
      this.productResource.name = '';
      this.productService.getProducts(this.productResource)
        .subscribe((resp: HttpResponse<Product[]>) => {
          this.products = [...resp.body];
          this.filterProductsMap[index.toString()] = [...resp.body];
        }, (err) => {
        });
    } else {
      this.filterProductsMap[index.toString()] = [...this.products];
    }

  }

  onProductSelectionChange(value: any, index: number) {
    const product = this.filterProductsMap[index].find((c: Product) => c.id === value.value);
    this.purchaseOrderItemsArray.controls[index].patchValue({
      filterProductValue: ''
    });
    this.purchaseOrderItemsArray.controls[index].patchValue({
      unitId: product.unitId
    });

    if (product.productTaxes.length) {
      this.purchaseOrderItemsArray.controls[index].patchValue({
        taxValue: product.productTaxes.map(c => c.taxId),
        warehouseId: product.warehouseId
      });
    }

  }

  supplierNameForSearchChangeValue() {
    this.sub$.sink = this.purchaseOrderReturnForm.get('filerSupplier').valueChanges
      .pipe(
        tap(c => this.isSupplierLoading = true),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.supplierResource.supplierName = c;
          this.supplierResource.id = null;
          return this.supplierService.getSuppliers(this.supplierResource);
        })
      ).subscribe((resp: HttpResponse<Supplier[]>) => {
        this.isSupplierLoading = false;
        if (resp && resp.headers) {
          this.suppliersForSearch = [...resp.body];
        }
      }, (err) => {
        this.isSupplierLoading = false;
      });
  }


  supplierNameChangeValue() {
    this.sub$.sink = this.purchaseOrderForm.get('filerSupplier').valueChanges
      .pipe(
        tap(c => this.isSupplierLoading = true),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.supplierResource.supplierName = c;
          this.supplierResource.id = null;
          return this.supplierService.getSuppliers(this.supplierResource);
        })
      ).subscribe((resp: HttpResponse<Supplier[]>) => {
        this.isSupplierLoading = false;
        if (resp && resp.headers) {
          this.suppliers = [...resp.body];
        }
      }, (err) => {
        this.isSupplierLoading = false;
      });
  }

  getSuppliers() {

    if (this.purchaseOrder) {
      this.supplierResource.id = this.purchaseOrder.supplierId;
    } else {
      this.supplierResource.supplierName = '';
      this.supplierResource.id = null;
    }
    this.supplierService.getSuppliers(this.supplierResource)
      .subscribe(resp => {
        if (resp && resp.headers) {
          this.suppliers = [...resp.body];
          this.suppliersForSearch = [...resp.body];
        }
      });
  }

  onPurchaseOrderSubmit() {
    if (!this.purchaseOrderForm.valid) {
      this.purchaseOrderForm.markAllAsTouched();
    } else {
      if (this.purchaseOrder && this.purchaseOrder.purchaseOrderStatus === PurchaseOrderStatusEnum.Return) {
        this.toastrService.error(this.translationService.getValue('RETURN_PURCHASE_ORDER_CANT_BE_EDITED'));
        return;
      }
      this.isLoading = true;
      const purchaseOrder = this.buildPurchaseOrder();
      if (purchaseOrder.id) {
        this.purchaseOrderService.updatePurchaseOrderReturn(purchaseOrder)
          .subscribe((c: PurchaseOrder) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('PURCHASE_ORDER_RETURN_ADDED'));
            this.router.navigate(['/purchase-order/list']);
          }, (err) => {
            this.isLoading = false;
          })
      }

    }
  }

  buildPurchaseOrder() {
    const purchaseOrder: PurchaseOrder = {
      id: this.purchaseOrder ? this.purchaseOrder.id : '',
      orderNumber: this.purchaseOrderForm.get('orderNumber').value,
      deliveryDate: this.purchaseOrderForm.get('deliveryDate').value,
      deliveryStatus: DeliveryStatusEnum.UnDelivery,
      isPurchaseOrderRequest: false,
      poCreatedDate: this.purchaseOrderForm.get('poCreatedDate').value,
      purchaseOrderStatus: PurchaseOrderStatusEnum.Return,
      supplierId: this.purchaseOrderForm.get('supplierId').value,
      totalAmount: this.grandTotal,
      totalDiscount: this.totalDiscount,
      totalTax: this.totalTax,
      note: this.purchaseOrderForm.get('note').value,
      purchaseOrderItems: []
    };

    const purchaseOrderItemsArray = this.purchaseOrderForm.get('purchaseOrderItems') as UntypedFormArray;
    const purchaseOrderItems = purchaseOrderItemsArray.getRawValue();
    if (purchaseOrderItems && purchaseOrderItems.length > 0) {
      purchaseOrderItems.forEach(po => {
        purchaseOrder.purchaseOrderItems.push(
          {
            discount: parseFloat(this.quantitiesUnitPriceTaxPipe.transform(po.reurnquntity, po.unitPrice, po.discountPercentage)),
            discountPercentage: po.discountPercentage,
            productId: po.productId,
            unitId:po.unitId,
            warehouseId: po.warehouseId,
            quantity: po.reurnquntity,
            taxValue: parseFloat(this.quantitiesUnitPriceTaxPipe.transform(po.reurnquntity, po.unitPrice, po.discountPercentage, po.taxValue, this.taxsMap[0])),
            unitPrice: parseFloat(po.unitPrice),
            purchaseOrderItemTaxes: po.taxValue ? [
              ...po.taxValue.map(element => {
                const purchaseOrderItemTaxes: PurchaseOrderItemTax = {
                  taxId: element
                };
                return purchaseOrderItemTaxes;
              })
            ] : []
          }
        )
      })
    }
    return purchaseOrder;
  }
  cancel() {
    this.location.back();
  }
}

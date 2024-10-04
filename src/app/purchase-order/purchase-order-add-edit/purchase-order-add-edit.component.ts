import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
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
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ProductService } from 'src/app/product/product.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { PurchaseOrderService } from '../purchase-order.service';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { DeliveryStatusEnum } from '@core/domain-classes/delivery-status-enum';
import { PurchaseOrderStatusEnum } from '@core/domain-classes/purchase-order-status';
import { PurchaseOrderItemTax } from '@core/domain-classes/purchase-order-item-tax';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order-item';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { ClonerService } from '@core/services/clone.service';
import { UnitConversationService } from 'src/app/unit-conversation/unit-conversation.service';
import { UnitConversation } from '@core/domain-classes/unit-conversation';
import { Operators } from '@core/domain-classes/operator';
import { WarehouseService } from '@core/services/warehouse.service';
import { Warehouse } from '@core/domain-classes/warehouse';

@Component({
  selector: 'app-purchase-order-add-edit',
  templateUrl: './purchase-order-add-edit.component.html',
  styleUrls: ['./purchase-order-add-edit.component.scss'],
  viewProviders: [QuantitiesUnitPricePipe, QuantitiesUnitPriceTaxPipe]
})
export class PurchaseOrderAddEditComponent extends BaseComponent {
  taxes$: Observable<Tax[]>;
  purchaseOrderForm: UntypedFormGroup;
  products: Product[] = [];
  suppliers: Supplier[] = [];
  warehouseList: Warehouse[] = [];
  supplierResource: SupplierResourceParameter;
  productResource: ProductResourceParameter;
  isLoading: boolean = false;
  isSupplierLoading: boolean = false;
  filterProductsMap: { [key: string]: Product[] } = {};
  unitsMap: { [key: string]: UnitConversation[] } = {};
  warehouseMap: { [key: string]: Warehouse[] } = {};
  unitConversationlist: UnitConversation[] = [];
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
    private warehouseService: WarehouseService,
  ) {
    super(translationService);
    this.getLangDir();
    this.supplierResource = new SupplierResourceParameter();
    this.productResource = new ProductResourceParameter();
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 50;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc';
    this.purchaseOrderResource.isPurchaseOrderRequest = true;
  }

  ngOnInit(): void {
    this.unitConversationlist = [... this.route.snapshot.data['units']];
    this.warehouseList = [... this.route.snapshot.data['warehouses']];
    this.createPurchaseOrder();
    this.getPurchaseOrderRequest();
    this.supplierNameChangeValue();
    this.getNewPurchaseOrderNumber();
    this.getPurchaseOrderRequestList();
    this.getPurchaseOrderRequestChange();
    this.getPurchaseOrderRequestIdChange();
    this.getTaxes();
    this.getProductByBarCodeValue();

  }

  getPurchaseOrderRequestChange() {
    this.purchaseOrderForm.get('purchaseOrderRequestOrderNumber').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe(c => {
        this.purchaseOrderResource.orderNumber = c;
        this.getPurchaseOrderRequestList();
      })
  }

  getPurchaseOrderRequestIdChange() {
    this.purchaseOrderForm.get('purchaseOrderRequestId').valueChanges
      .subscribe(c => {
        this.getPurchaseOrderRequestById(c);
        // this.purchaseOrderResource.orderNumber='';
        // this.getPurchaseOrderRequestList();
      })
  }

  getPurchaseOrderRequestList() {
    this.purchaseOrderService.getAllPurchaseOrder(this.purchaseOrderResource)
      .subscribe((resp: HttpResponse<PurchaseOrder[]>) => {
        if (resp && resp.headers) {
          const paginationParam = JSON.parse(
            resp.headers.get('X-Pagination')
          ) as ResponseHeader;
          this.purchaseOrderRequestList = [...resp.body];
        }
      });

  }

  getTaxes() {
    this.taxes$ = this.taxService.entities$;
  }

  getPurchaseOrderRequest() {
    this.sub$.sink = this.route.queryParamMap.pipe(
      map((params: ParamMap) => params.get('purchase-order-requestId')),
    ).subscribe(c => {
      if (c)
        this.getPurchaseOrderRequestById(c)
    });
  }

  getPurchaseOrderRequestById(id: string) {
    this.purchaseOrderService.getPurchaseOrderById(id)
      .subscribe((c: PurchaseOrder) => {
        if (c) {
          this.purchaseOrderForm.patchValue({
            purchaseOrderRequestOrderNumber: '',
            filerSupplier: '',
            deliveryDate: c.deliveryDate,
            poCreatedDate: c.poCreatedDate,
            deliveryStatus: c.deliveryStatus,
            supplierId: c.supplierId,
            note: c.note,
            termAndCondition: c.termAndCondition
          });

          this.clearFormArray();

          c.purchaseOrderItems.forEach(item => {
            this.purchaseOrderItemsArray.push(this.createPurchaseOrderItemPatch(this.purchaseOrderItemsArray.length, item));
          });

          this.supplierResource.id = c.supplierId;

          this.supplierService.getSuppliers(this.supplierResource)
            .subscribe(resp => {
              if (resp && resp.headers) {
                this.suppliers = [...resp.body];
              }
            });

          this.getAllTotal();
        }
      });
  }
  clearFormArray() {
    while (this.purchaseOrderItemsArray.length !== 0) {
      this.purchaseOrderItemsArray.removeAt(0)
    }
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
            purchaseOrderRequestId: [{ value: '', disabled: true }],
            purchaseOrderRequestOrderNumber: [{ value: '', disabled: true }],
            orderNumber: [{ value: this.purchaseOrder.orderNumber, disabled: false }, [Validators.required]],
            filerSupplier: [''],
            deliveryDate: [this.purchaseOrder.deliveryDate, [Validators.required]],
            poCreatedDate: [this.purchaseOrder.poCreatedDate, [Validators.required]],
            deliveryStatus: [this.purchaseOrder.deliveryStatus],
            supplierId: [this.purchaseOrder.supplierId, [Validators.required]],
            note: [this.purchaseOrder.note],
            filterBarCodeValue: [''],
            termAndCondition: [this.purchaseOrder.termAndCondition],
            purchaseOrderItems: this.fb.array([])
          });
          this.purchaseOrder.purchaseOrderItems.forEach(c => {
            this.purchaseOrderItemsArray.push(this.createPurchaseOrderItemPatch(this.purchaseOrderItemsArray.length, c));
          });
          this.getSuppliers();
          this.getAllTotal();
        } else {
          this.isEdit = false;
          this.getSuppliers();
          this.purchaseOrderForm = this.fb.group({
            purchaseOrderRequestId: [''],
            purchaseOrderRequestOrderNumber: [''],
            orderNumber: ['', [Validators.required]],
            filerSupplier: [''],
            deliveryDate: [new Date(), [Validators.required]],
            poCreatedDate: [new Date(), [Validators.required]],
            deliveryStatus: [1],
            supplierId: ['', [Validators.required]],
            note: [''],
            filterBarCodeValue: [''],
            termAndCondition: [''],
            purchaseOrderItems: this.fb.array([])
          });
          this.purchaseOrderItemsArray.push(this.createPurchaseOrderItem(this.purchaseOrderItemsArray.length));
        }

      });
  }

  getProductByBarCodeValue() {
    this.sub$.sink = this.purchaseOrderForm.get('filterBarCodeValue').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          if (c) {
            this.productResource.barcode = c;
            return this.productService.getProducts(this.productResource);
          } {
            return of([]);
          }
        })
      ).subscribe((resp: HttpResponse<Product[]>) => {
        if (resp && resp.headers) {
          if (resp.body.length == 1) {

            if (this.purchaseOrderItemsArray.length == 1) {
              if (!this.purchaseOrderItemsArray.controls[0].get('productId').value) {
                this.onRemovePurchaseOrderItem(0);
              }
            }

            const productId = (resp.body[0] as Product).id;
            let purchaseOrderItems: PurchaseOrderItem[] = this.purchaseOrderItemsArray.value;
            var existingProductIndex = purchaseOrderItems.findIndex(c => c.productId == productId);

            if (existingProductIndex >= 0) {
              let iteamToUpdate = purchaseOrderItems[existingProductIndex];
              this.purchaseOrderItemsArray.at(existingProductIndex).get('quantity').patchValue(iteamToUpdate.quantity + 1)
            } else {
              this.onAddAnotherProduct();
              const currentIndex = this.purchaseOrderItemsArray.length - 1;
              this.filterProductsMap[currentIndex.toString()] = [...resp.body];
              this.onProductSelectionChange(productId, currentIndex, false);
            }
            this.getAllTotal();
          } else {
            this.toastrService.warning('Product not found');
          }
          this.productResource.barcode = '';
          this.purchaseOrderForm.get('filterBarCodeValue').patchValue('');
        }
      }, (err) => {

      });
  }

  onAddAnotherProduct() {
    this.purchaseOrderItemsArray.push(this.createPurchaseOrderItem(this.purchaseOrderItemsArray.length));
  }

  createPurchaseOrderItemPatch(index: number, purchaseOrderItem: PurchaseOrderItem) {
    const taxs = purchaseOrderItem.purchaseOrderItemTaxes.map(c => c.taxId);
    const formGroup = this.fb.group({
      productId: [purchaseOrderItem.productId, [Validators.required]],
      filterProductValue: [''],
      unitPrice: [purchaseOrderItem.unitPrice, [Validators.required]],
      quantity: [purchaseOrderItem.quantity, [Validators.required]],
      taxValue: [taxs],
      unitId: [purchaseOrderItem.unitId, [Validators.required]],
      warehouseId: [purchaseOrderItem.warehouseId],
      discountPercentage: [purchaseOrderItem.discountPercentage]
    });

    this.unitsMap[index] = this.unitConversationlist.filter(c => c.id == purchaseOrderItem.product.unitId || c.parentId == purchaseOrderItem.product.unitId);;
    this.taxsMap[index] = [... this.route.snapshot.data['taxs']];
    this.warehouseMap[index] = this.warehouseList;
    this.filterProductsMap[index.toString()] = [purchaseOrderItem.product];
    this.getProductByNameValue(formGroup, index);
    return formGroup;
  }

  createPurchaseOrderItem(index: number) {
    const formGroup = this.fb.group({
      productId: ['', [Validators.required]],
      filterProductValue: [''],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      taxValue: [null],
      unitId: ['', [Validators.required]],
      warehouseId: [''],
      discountPercentage: [0, [Validators.min(0)]]
    });
    this.taxsMap[index] = [... this.route.snapshot.data['taxs']];
    this.warehouseMap[index] = this.warehouseList;
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
    let purchaseOrderItems = this.purchaseOrderForm.get('purchaseOrderItems').value;
    this.totalBeforeDiscount = 0;
    this.grandTotal = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    if (purchaseOrderItems && purchaseOrderItems.length > 0) {
      purchaseOrderItems.forEach(po => {
        if (po.unitPrice && po.quantity) {
          const totalBeforeDiscount = this.totalBeforeDiscount + parseFloat(this.quantitiesUnitPricePipe.transform(po.quantity, po.unitPrice));
          this.totalBeforeDiscount = parseFloat(totalBeforeDiscount.toFixed(2));
          const gradTotal = this.grandTotal + parseFloat(this.quantitiesUnitPricePipe.transform(po.quantity, po.unitPrice, po.discountPercentage, po.taxValue, this.taxsMap[0]));
          this.grandTotal = parseFloat(gradTotal.toFixed(2));
          const totalTax = this.totalTax + parseFloat(this.quantitiesUnitPriceTaxPipe.transform(po.quantity, po.unitPrice, po.discountPercentage, po.taxValue, this.taxsMap[0]));
          this.totalTax = parseFloat(totalTax.toFixed(2));
          const totalDiscount = this.totalDiscount + parseFloat(this.quantitiesUnitPriceTaxPipe.transform(po.quantity, po.unitPrice, po.discountPercentage));
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
      if (productId) {
        this.purchaseOrder.purchaseOrderItems.map(pi => {
          if (pi.product.id === productId) {
            if (this.products.find(c => c.id === productId)) {
              this.getProducts(index);
            } else {
              this.getProducts(index, productId);
            }
          }
        });
      } else {
        this.getProducts(index);
      }
    });
    this.getAllTotal();
  }

  getProducts(index: number, productId?: string) {
    if (this.products.length === 0 || productId) {
      this.productResource.name = '';
      this.productResource.id = productId ? productId : '';
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

  setUnitConversationForProduct(id: string, index: number) {
    this.unitsMap[index] = this.unitConversationlist.filter(c => c.id == id || c.parentId == id);
  }

  setWarehouseForProduct(id: string, index: number) {

    this.warehouseMap[index] = id  ? this.warehouseList.filter(c => c.id == id) : this.warehouseList;
  }

  onSelectionChange(unitId: any, index: number, isFromUI = true) {
    const productId = this.purchaseOrderItemsArray.controls[index].get('productId').value;
    const product = this.filterProductsMap[index].find(c => c.id === productId);
    const unit = this.unitConversationlist.find(c => c.id === unitId);

    let price = 0;

    if (unit.value) {
      switch (unit.operator) {
        case Operators.Plush:
          price = product.purchasePrice + parseFloat(unit.value);
          break;
        case Operators.Minus:
          price = product.purchasePrice - parseFloat(unit.value);
          break;
        case Operators.Multiply:
          price = product.purchasePrice * parseFloat(unit.value);
          break;
        case Operators.Divide:
          price = product.purchasePrice / parseFloat(unit.value);
          break;
      }
      this.purchaseOrderItemsArray.controls[index].patchValue({
        unitPrice: price,
      });

    } else {
      this.purchaseOrderItemsArray.controls[index].patchValue({
        unitPrice: product.purchasePrice,
        unitId: unitId,
        warehouseId: product.warehouseId
      });
    }
  }

  onProductSelectionChange(productId: any, index: number, isFromUI = true) {
    const product = this.filterProductsMap[index].find((c: Product) => c.id === productId);
    this.setUnitConversationForProduct(product.unitId, index);
    //this.setWarehouseForProduct(product.warehouseId, index);
    if (isFromUI) {
      this.purchaseOrderItemsArray.controls[index].patchValue({
        filterProductValue: ''

      });
    } else {
      this.purchaseOrderItemsArray.controls[index].patchValue({
        productId: productId,

      });
    }

    this.purchaseOrderItemsArray.controls[index].patchValue({
      unitPrice: product.purchasePrice,
      unitId: product.unitId,
      warehouseId: product.warehouseId
    });

    if (product.productTaxes.length) {
      this.purchaseOrderItemsArray.controls[index].patchValue({
        taxValue: product.productTaxes.map(c => c.taxId)
      });
    }
    this.getAllTotal();
  }

  getNewPurchaseOrderNumber() {
    if (!this.purchaseOrder) {
      this.purchaseOrderService.getNewPurchaseOrderNumber(true)
        .subscribe(purchaseOrder => {
          this.purchaseOrderForm.patchValue({
            orderNumber: purchaseOrder.orderNumber
          });
        });
    }
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
        this.purchaseOrderService.updatePurchaseOrder(purchaseOrder)
          .subscribe((c: PurchaseOrder) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('PURCHASE_ORDER_UPDATED_SUCCESSFULLY'));
            this.router.navigate(['/purchase-order/list']);
          }, (err) => {
            this.isLoading = false;
          })
      } else {
        this.purchaseOrderService.addPurchaseOrder(purchaseOrder)
          .subscribe((c: PurchaseOrder) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('PURCHASE_ORDER_ADDED_SUCCESSFULLY'));
            this.router.navigate(['/purchase-order/list']);
          }, (err) => {
            this.isLoading = false;
          });
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
      purchaseOrderStatus: PurchaseOrderStatusEnum.Not_Return,
      supplierId: this.purchaseOrderForm.get('supplierId').value,
      totalAmount: this.grandTotal,
      totalDiscount: this.totalDiscount,
      totalTax: this.totalTax,
      note: this.purchaseOrderForm.get('note').value,
      termAndCondition: this.purchaseOrderForm.get('termAndCondition').value,
      purchaseOrderItems: []
    };

    const purchaseOrderItems = this.purchaseOrderForm.get('purchaseOrderItems').value;
    if (purchaseOrderItems && purchaseOrderItems.length > 0) {
      purchaseOrderItems.forEach(po => {
        purchaseOrder.purchaseOrderItems.push(
          {
            discount: parseFloat(this.quantitiesUnitPriceTaxPipe.transform(po.quantity, po.unitPrice, po.discountPercentage)),
            discountPercentage: po.discountPercentage,
            productId: po.productId,
            unitId: po.unitId,
            warehouseId: po.warehouseId,
            quantity: po.quantity,
            taxValue: parseFloat(this.quantitiesUnitPriceTaxPipe.transform(po.quantity, po.unitPrice, po.discountPercentage, po.taxValue, this.taxsMap[0])),
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
}

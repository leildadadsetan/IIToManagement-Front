import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '@core/domain-classes/customer';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { DeliveryStatusEnum } from '@core/domain-classes/delivery-status-enum';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { PurchaseOrderStatusEnum } from '@core/domain-classes/purchase-order-status';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderItem } from '@core/domain-classes/sales-order-item';
import { SalesOrderItemTax } from '@core/domain-classes/sales-order-item-tax';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { SalesOrderStatusEnum } from '@core/domain-classes/sales-order-status';
import { Tax } from '@core/domain-classes/tax';
import { Unit } from '@core/domain-classes/unit';
import { TaxService } from '@core/services/tax.service';
import { QuantitiesUnitPriceTaxPipe } from '@shared/pipes/quantities-unitprice-tax.pipe';
import { QuantitiesUnitPricePipe } from '@shared/pipes/quantities-unitprice.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { CustomerService } from 'src/app/customer/customer.service';
import { ProductService } from 'src/app/product/product.service';
import { SalesOrderService } from 'src/app/sales-order/sales-order.service';
import { Location } from '@angular/common';
import { ClonerService } from '@core/services/clone.service';
import { TranslationService } from '@core/services/translation.service';
import { Warehouse } from '@core/domain-classes/warehouse';

@Component({
  selector: 'app-sale-order-return',
  templateUrl: './sale-order-return.component.html',
  styleUrls: ['./sale-order-return.component.scss'],
  viewProviders: [QuantitiesUnitPricePipe, QuantitiesUnitPriceTaxPipe]
})
export class SaleOrderReturnComponent extends BaseComponent {
  taxes$: Observable<Tax[]>;
  salesOrderForm: UntypedFormGroup;
  salesOrderReturnForm: UntypedFormGroup;
  products: Product[] = [];
  customersForSearch: Customer[] = [];
  customers: Customer[] = [];
  customerResource: CustomerResourceParameter;
  salesResouce: SalesOrderResourceParameter;
  productResource: ProductResourceParameter;
  salesorders: SalesOrder[] = [];
  isLoading: boolean = false;
  isCustomerLoading: boolean = false;
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
  salesOrder: SalesOrder;
  isEdit: boolean = false;
  salesOrderResource: SalesOrderResourceParameter;

  get salesOrderItemsArray(): UntypedFormArray {
    return <UntypedFormArray>this.salesOrderForm.get('salesOrderItems');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
    private toastrService: ToastrService,
    private salesOrderService: SalesOrderService,
    private router: Router,
    private taxService: TaxService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private quantitiesUnitPricePipe: QuantitiesUnitPricePipe,
    private quantitiesUnitPriceTaxPipe: QuantitiesUnitPriceTaxPipe,
    private location: Location,
    private cloneService: ClonerService,
    public translationService: TranslationService
  ) {
super(translationService);
    this.getLangDir();
    this.salesResouce = new SalesOrderResourceParameter();
    this.salesOrderResource = new SalesOrderResourceParameter();
    this.customerResource = new CustomerResourceParameter();
    this.productResource = new ProductResourceParameter();
  }

  ngOnInit(): void {
    this.createSalesOrder();
    this.getTaxes();
  }

  onFilterValue(filterValue: any) {
    console.log(filterValue);
  }

  getTaxes() {
    this.taxes$ = this.taxService.entities$;
  }

  createSalesOrderReturnOrder() {
    this.salesOrderReturnForm = this.fb.group({
      orderNumber: [''],
      filerCustomer: [''],
      customerId: [''],
      salesOrderId: [''],
      filerSalesOrder: ['']
    });
    this.getCustomers();
    this.customerNameForSearchChangeValue();
    this.subscribeCustomerChangeEvent();
    this.subscribeSalesOrderFilterChangeEvent();
    this.onSalesOrderChange();
  }

  subscribeCustomerChangeEvent() {
    this.salesOrderReturnForm.get('customerId').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.salesResouce.customerId = c;
          this.salesResouce.status = SalesOrderStatusEnum.Not_Return;
          return this.salesOrderService.getAllSalesOrder(this.salesResouce);
        })
      ).subscribe((resp: HttpResponse<SalesOrder[]>) => {
        if (resp && resp.headers) {
          this.salesorders = [...resp.body];
        }
      });
  }

  subscribeSalesOrderFilterChangeEvent() {
    this.salesOrderReturnForm.get('filerSalesOrder').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.salesResouce.orderNumber = c;
          return this.salesOrderService.getAllSalesOrder(this.salesResouce);
        })
      ).subscribe((resp: HttpResponse<SalesOrder[]>) => {
        if (resp && resp.headers) {
          this.salesorders = [...resp.body];
        }
      });
  }

  onSalesOrderChange() {
    this.salesOrderReturnForm.get('salesOrderId').valueChanges
      .subscribe(id => {
        if (id) {
          this.router.navigate(['/sales-order-return', id]);
        }
      });
  }


  createSalesOrder() {
    this.route.data
      .pipe(
    )
      .subscribe((salesOrderData: { 'salesorder': SalesOrder }) => {
        this.salesOrder = salesOrderData.salesorder;
        if (this.salesOrder) {
          this.isEdit = true;
          this.salesOrderForm = this.fb.group({
            orderNumber: [{ value: this.salesOrder.orderNumber, disabled: true }],
            filerCustomer: [{ value: '', disabled: true }],
            deliveryDate: [{ value: this.salesOrder.deliveryDate, disabled: true }],
            soCreatedDate: [{ value: this.salesOrder.soCreatedDate, disabled: true }],
            deliveryStatus: [{ value: SalesOrderStatusEnum.Return, disabled: true }],
            customerId: [{ value: this.salesOrder.customerId, disabled: true }],
            note: [{ value: '', disabled: false }],
            salesOrderItems: this.fb.array([])
          });
          this.salesOrder.salesOrderItems.forEach(c => {
            this.salesOrderItemsArray.push(this.createSalesOrderItemPatch(this.salesOrderItemsArray.length, c));
          });
          this.customerNameChangeValue();
          this.getCustomers();
          this.getAllTotal();
        } else {
          this.createSalesOrderReturnOrder();
          this.salesResouce.pageSize = 10;
          this.salesResouce.status = SalesOrderStatusEnum.Not_Return;
          this.salesOrderService.getAllSalesOrder(this.salesResouce)
            .subscribe((resp: HttpResponse<SalesOrder[]>) => {
              if (resp && resp.headers) {
                this.salesorders = [...resp.body];
              }
            })
        }
      });
  }

  createSalesOrderItemPatch(index: number, salesOrderItem: SalesOrderItem) {
    const taxs = salesOrderItem.salesOrderItemTaxes.map(c => c.taxId);
    const formGroup = this.fb.group({
      productId: [{ value: salesOrderItem.productId, disabled: true }],
      unitPrice: [{ value: salesOrderItem.unitPrice, disabled: true }],
      quantity: [{ value: salesOrderItem.quantity, disabled: true }],
      returnquantity: [{ value: salesOrderItem.quantity, disabled: false }, [Validators.required, Validators.max(salesOrderItem.quantity), Validators.min(1)]],
      taxValue: [{ value: taxs, disabled: true }],
      unitId: [{ value: salesOrderItem.unitId, disabled: true }],
      warehouseId:  [{ value: salesOrderItem.warehouseId, disabled: true }],
      discountPercentage: [{ value: salesOrderItem.discountPercentage, disabled: true }]
    });
    this.unitsMap[index] = [... this.route.snapshot.data['units']];
    this.warehouseMap[index] =  [... this.route.snapshot.data['warehouses']];
    this.taxsMap[index] = [... this.route.snapshot.data['taxs']];
    this.filterProductsMap[index.toString()] = [salesOrderItem.product];
    return formGroup;
  }

  customerNameForSearchChangeValue() {
    this.sub$.sink = this.salesOrderReturnForm.get('filerCustomer').valueChanges
      .pipe(
        tap(c => this.isCustomerLoading = true),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.customerResource.customerName = c;
          this.customerResource.id = null;
          return this.customerService.getCustomers(this.customerResource);
        })
      ).subscribe((resp: HttpResponse<Customer[]>) => {
        this.isCustomerLoading = false;
        if (resp && resp.headers) {
          this.customersForSearch = [...resp.body];
        }
      }, (err) => {
        this.isCustomerLoading = false;
      });
  }


  customerNameChangeValue() {
    this.sub$.sink = this.salesOrderForm.get('filerCustomer').valueChanges
      .pipe(
        tap(c => this.isCustomerLoading = true),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.customerResource.customerName = c;
          this.customerResource.id = null;
          return this.customerService.getCustomers(this.customerResource);
        })
      ).subscribe((resp: HttpResponse<Customer[]>) => {
        this.isCustomerLoading = false;
        if (resp && resp.headers) {
          this.customers = [...resp.body];
        }
      }, (err) => {
        this.isCustomerLoading = false;
      });
  }

  getAllTotal() {
    let salesOrderItemsArray = this.salesOrderForm.get('salesOrderItems') as UntypedFormArray;
    let salesOrderItems = salesOrderItemsArray.getRawValue();
    this.totalBeforeDiscount = 0;
    this.grandTotal = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    if (salesOrderItems && salesOrderItems.length > 0) {
      salesOrderItems.forEach(so => {
        if (so.unitPrice && so.returnquantity) {
          const totalBeforeDiscount = this.totalBeforeDiscount + parseFloat(this.quantitiesUnitPricePipe.transform(so.returnquantity, so.unitPrice));
          this.totalBeforeDiscount = parseFloat(totalBeforeDiscount.toFixed(2));
          const gradTotal = this.grandTotal + parseFloat(this.quantitiesUnitPricePipe.transform(so.returnquantity, so.unitPrice, so.discountPercentage, so.taxValue, this.taxsMap[0]));
          this.grandTotal = parseFloat(gradTotal.toFixed(2));
          const totalTax = this.totalTax + parseFloat(this.quantitiesUnitPriceTaxPipe.transform(so.returnquantity, so.unitPrice, so.discountPercentage, so.taxValue, this.taxsMap[0]));
          this.totalTax = parseFloat(totalTax.toFixed(2));
          const totalDiscount = this.totalDiscount + parseFloat(this.quantitiesUnitPriceTaxPipe.transform(so.returnquantity, so.unitPrice, so.discountPercentage));
          this.totalDiscount = parseFloat(totalDiscount.toFixed(2));
        }
      })
    }
  }

  onQuantityChange() {
    this.getAllTotal();
  }

  onRemoveSalesOrderItem(index: number) {
    this.salesOrderItemsArray.removeAt(index);

    this.salesOrderItemsArray.controls.forEach((c: UntypedFormGroup, index: number) => {
      const productId = c.get('productId').value;
      this.salesOrder.salesOrderItems.map(pi => {
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
    this.salesOrderItemsArray.controls[index].patchValue({
      filterProductValue: ''
    });
    const product = this.filterProductsMap[index].find((c: Product) => c.id === value.value);
    if (product) {
      this.salesOrderItemsArray.controls[index].patchValue({
        unitId: product.unitId,
        warehouseId: product.warehouseId
      });
    }
  }

  getNewSalesOrderNumber() {
    this.salesOrderService.getNewSalesOrderNumber().subscribe(salesOrder => {
      if (!this.salesOrder) {
        this.salesOrderForm.patchValue({
          orderNumber: salesOrder.orderNumber
        });
      }
    });
  }


  getCustomers() {
    if (this.salesOrder) {
      this.customerResource.id = this.salesOrder.customerId;
    } else {
      this.customerResource.customerName = '';
      this.customerResource.id = null;
    }
    this.customerService.getCustomers(this.customerResource)
      .subscribe(resp => {
        if (resp && resp.headers) {
          this.customers = [...resp.body];
          this.customersForSearch = [...resp.body];
        }
      });
  }

  onSalesOrderSubmit() {
    if (!this.salesOrderForm.valid) {
      this.salesOrderForm.markAllAsTouched();
    } else {
      if (this.salesOrder && this.salesOrder.salesOrderStatus === SalesOrderStatusEnum.Return) {
        this.toastrService.error("Sales Order can't edit becuase it's already approved.");
        return;
      }
      const salesOrder = this.buildSalesOrder();
      if (salesOrder.id) {
        this.salesOrderService.updateSalesOrderReturn(salesOrder)
          .subscribe((c: SalesOrder) => {
            this.toastrService.success('Sales order return added.');
            this.router.navigate(['/sales-order/list']);
          })
      }
    }
  }

  buildSalesOrder() {
    const salesOrder: SalesOrder = {
      id: this.salesOrder ? this.salesOrder.id : '',
      orderNumber: this.salesOrderForm.get('orderNumber').value,
      deliveryDate: this.salesOrderForm.get('deliveryDate').value,
      deliveryStatus: DeliveryStatusEnum.UnDelivery,
      isSalesOrderRequest: false,
      soCreatedDate: this.salesOrderForm.get('soCreatedDate').value,
      salesOrderStatus: SalesOrderStatusEnum.Return,
      customerId: this.salesOrderForm.get('customerId').value,
      totalAmount: this.grandTotal,
      totalDiscount: this.totalDiscount,
      totalTax: this.totalTax,
      note: this.salesOrderForm.get('note').value,
      salesOrderItems: []
    };

    const salesOrderItemsArray = this.salesOrderForm.get('salesOrderItems') as UntypedFormArray;
    const salesOrderItems = salesOrderItemsArray.getRawValue();
    if (salesOrderItems && salesOrderItems.length > 0) {
      salesOrderItems.forEach(so => {
        salesOrder.salesOrderItems.push(
          {
            discount: parseFloat(this.quantitiesUnitPriceTaxPipe.transform(so.returnquantity, so.unitPrice, so.discountPercentage)),
            discountPercentage: so.discountPercentage,
            productId: so.productId,
            unitId:so.unitId,
            warehouseId: so.warehouseId,
            quantity: so.returnquantity,
            taxValue: parseFloat(this.quantitiesUnitPriceTaxPipe.transform(so.returnquantity, so.unitPrice, so.discountPercentage, so.taxValue, this.taxsMap[0])),
            unitPrice: parseFloat(so.unitPrice),
            salesOrderItemTaxes: so.taxValue ? [
              ...so.taxValue.map(element => {
                const salesOrderItemTaxes: SalesOrderItemTax = {
                  taxId: element
                };
                return salesOrderItemTaxes;
              })
            ] : []
          }
        )
      })
    }
    return salesOrder;
  }

  cancel() {
    this.location.back();
  }
}

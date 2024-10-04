import { HttpResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '@core/domain-classes/customer';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { DeliveryStatusEnum } from '@core/domain-classes/delivery-status-enum';
import { Operators } from '@core/domain-classes/operator';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderItem } from '@core/domain-classes/sales-order-item';
import { SalesOrderItemTax } from '@core/domain-classes/sales-order-item-tax';
import { SalesOrderStatusEnum } from '@core/domain-classes/sales-order-status';
import { Tax } from '@core/domain-classes/tax';
import { UnitConversation } from '@core/domain-classes/unit-conversation';
import { ClonerService } from '@core/services/clone.service';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { QuantitiesUnitPriceTaxPipe } from '@shared/pipes/quantities-unitprice-tax.pipe';
import { QuantitiesUnitPricePipe } from '@shared/pipes/quantities-unitprice.pipe';
import { IDetect } from 'ngx-barcodeput';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { BaseComponent } from '../base.component';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { SalesOrderService } from '../sales-order/sales-order.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'],
  viewProviders: [QuantitiesUnitPricePipe, QuantitiesUnitPriceTaxPipe],
})
export class PosComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  salesOrderForm: UntypedFormGroup;
  products: Product[] = [];
  filterProducts: Product[] = [];
  customers: Customer[] = [];
  customerResource: CustomerResourceParameter;
  productResource: ProductResourceParameter;
  isLoading: boolean = false;
  isCustomerLoading: boolean = false;
  filterProductsMap: { [key: string]: Product[] } = {};
  unitsMap: { [key: string]: UnitConversation[] } = {};
  unitConversationlist: UnitConversation[] = [];
  taxsMap: { [key: string]: Tax[] } = {};
  totalBeforeDiscount: number = 0;
  totalAfterDiscount: number = 0;
  totalDiscount: number = 0;
  grandTotal: number = 0;
  totalTax: number = 0;
  timeoutclear: any;
  salesOrder: SalesOrder;
  isEdit: boolean = false;
  baseUrl = environment.apiUrl;
  isFromScanner = false;
  @ViewChild('filterValue') filterValue: ElementRef;
  get salesOrderItemsArray(): UntypedFormArray {
    return <UntypedFormArray>this.salesOrderForm.get('salesOrderItems');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
    private toastrService: ToastrService,
    private salesOrderService: SalesOrderService,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private quantitiesUnitPricePipe: QuantitiesUnitPricePipe,
    private quantitiesUnitPriceTaxPipe: QuantitiesUnitPriceTaxPipe,
    public translationService: TranslationService,
    private clonerService: ClonerService
  ) {
    super(translationService);
    this.getLangDir();
    this.customerResource = new CustomerResourceParameter();
    this.productResource = new ProductResourceParameter();
  }

  ngOnInit(): void {
    this.unitConversationlist = [...this.route.snapshot.data['units']];
    this.createSalesOrder();
    this.getProducts();
    this.customerNameChangeValue();
    this.getNewSalesOrderNumber();
    this.salesOrderForm.get('filterProductValue').setValue('');
  }

  ngAfterViewInit(): void {
    this.filterValue.nativeElement.focus();
  }

  createSalesOrder() {
    this.route.data
      .pipe()
      .subscribe((salesOrderData: { salesorder: SalesOrder }) => {
        this.salesOrder = salesOrderData.salesorder;
        this.isEdit = false;
        this.getCustomers();
        this.salesOrderForm = this.fb.group({
          orderNumber: ['', [Validators.required]],
          filerCustomer: [''],
          deliveryDate: [new Date(), [Validators.required]],
          soCreatedDate: [new Date(), [Validators.required]],
          deliveryStatus: [1],
          customerId: ['', [Validators.required]],
          note: [''],
          termAndCondition: [''],
          salesOrderItems: this.fb.array([]),
          filterProductValue: [''],
        });
      });
  }

  setUnitConversationForProduct(id: string, index: number) {
    this.unitsMap[index] = this.unitConversationlist.filter(
      (c) => c.id == id || c.parentId == id
    );
  }

  onSelectionChange(unitId: any, index: number, isFromUI = true) {
    const productId =
      this.salesOrderItemsArray.controls[index].get('productId').value;
    const product = this.filterProducts.find((c) => c.id === productId);
    const unit = this.unitConversationlist.find((c) => c.id === unitId);
    let price = 0;

    if (unit.value) {
      switch (unit.operator) {
        case Operators.Plush:
          price = product.salesPrice + parseFloat(unit.value);
          break;
        case Operators.Minus:
          price = product.salesPrice - parseFloat(unit.value);
          break;
        case Operators.Multiply:
          price = product.salesPrice * parseFloat(unit.value);
          break;
        case Operators.Divide:
          price = product.salesPrice / parseFloat(unit.value);
          break;
      }
      this.salesOrderItemsArray.controls[index].patchValue({
        unitPrice: price,
      });
    } else {
      this.salesOrderItemsArray.controls[index].patchValue({
        unitPrice: product.salesPrice,
      });
    }
  }

  onProductSelect(product: Product, index: number) {
    let salesOrderItems: SalesOrderItem[] =
      this.salesOrderForm.get('salesOrderItems').value;

    const existingProductIndex = salesOrderItems.findIndex(
      (c) => c.productId == product.id
    );
    let newIndex = existingProductIndex;
    if (existingProductIndex >= 0) {
      let iteamToUpdate = salesOrderItems[existingProductIndex];
      this.salesOrderItemsArray
        .at(existingProductIndex)
        .get('quantity')
        .patchValue(iteamToUpdate.quantity + 1);
    } else {
      newIndex = this.salesOrderItemsArray.length;
      this.salesOrderItemsArray.push(
        this.createSalesOrderItem(this.salesOrderItemsArray.length, product)
      );
    }
    this.setUnitConversationForProduct(product.unitId, newIndex);
    this.getAllTotal();
    this.filterValue.nativeElement.focus();
  }

  createSalesOrderItem(index: number, product: Product) {
    const taxs = product.productTaxes.map((c) => c.taxId);
    const formGroup = this.fb.group({
      productId: [product.id],
      warehouseId: [product.warehouseId],
      unitPrice: [product.salesPrice, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      taxValue: [taxs],
      unitId: [product.unitId, [Validators.required]],
      discountPercentage: [0, [Validators.min(0)]],
      productName: [product.name],
    });
    this.unitsMap[index] = this.unitConversationlist.filter(
      (c) => c.id == product.unitId || c.parentId == product.unitId
    );
    this.taxsMap[index] = [...this.route.snapshot.data['taxs']];
    return formGroup;
  }

  public onDetected(event: IDetect) {
    if (event?.type == 'scanner') {
      this.isFromScanner = true;
    } else {
      this.isFromScanner = false;
    }
  }

  getProducts() {
    this.sub$.sink = this.salesOrderForm
      .get('filterProductValue')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => {
          if (this.isFromScanner) {
            this.productResource.barcode = c;
          } else {
            this.productResource.name = c;
          }
          this.productResource.pageSize = 12;
          return this.productService.getProducts(this.productResource);
        })
      )
      .subscribe(
        (resp: HttpResponse<Product[]>) => {
          if (resp && resp.headers) {
            if (this.isFromScanner) {
              this.isFromScanner = false;
              if (resp.body.length == 1) {
                this.onProductSelect(
                  this.clonerService.deepClone<Product>(resp.body[0]),
                  null
                );
                this.toastrService.success('Product Added Successfully');
              } else {
                this.toastrService.warning('Product not found');
              }
              this.productResource.barcode = '';
              this.salesOrderForm.get('filterProductValue').patchValue('');
            } else {
              this.filterProducts = this.clonerService.deepClone<Product[]>(
                resp.body
              );
            }
          }
        },
        (err) => {
          this.isFromScanner = false;
        }
      );
  }

  getAllTotal() {
    let salesOrderItems = this.salesOrderForm.get('salesOrderItems').value;
    this.totalBeforeDiscount = 0;
    this.grandTotal = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    if (salesOrderItems && salesOrderItems.length > 0) {
      salesOrderItems.forEach((so) => {
        if (so.unitPrice && so.quantity) {
          const totalBeforeDiscount =
            this.totalBeforeDiscount +
            parseFloat(
              this.quantitiesUnitPricePipe.transform(so.quantity, so.unitPrice)
            );
          this.totalBeforeDiscount = parseFloat(totalBeforeDiscount.toFixed(2));
          const gradTotal =
            this.grandTotal +
            parseFloat(
              this.quantitiesUnitPricePipe.transform(
                so.quantity,
                so.unitPrice,
                so.discountPercentage,
                so.taxValue,
                this.taxsMap[0]
              )
            );
          this.grandTotal = parseFloat(gradTotal.toFixed(2));
          const totalTax =
            this.totalTax +
            parseFloat(
              this.quantitiesUnitPriceTaxPipe.transform(
                so.quantity,
                so.unitPrice,
                so.discountPercentage,
                so.taxValue,
                this.taxsMap[0]
              )
            );
          this.totalTax = parseFloat(totalTax.toFixed(2));
          const totalDiscount =
            this.totalDiscount +
            parseFloat(
              this.quantitiesUnitPriceTaxPipe.transform(
                so.quantity,
                so.unitPrice,
                so.discountPercentage
              )
            );
          this.totalDiscount = parseFloat(totalDiscount.toFixed(2));
        }
      });
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

  onRemoveSalesOrderItem(index: number) {
    this.salesOrderItemsArray.removeAt(index);
    this.getAllTotal();
  }

  getNewSalesOrderNumber() {
    this.salesOrderService.getNewSalesOrderNumber().subscribe((salesOrder) => {
      if (!this.salesOrder) {
        this.salesOrderForm.patchValue({
          orderNumber: salesOrder.orderNumber,
        });
      }
    });
  }

  customerNameChangeValue() {
    this.sub$.sink = this.salesOrderForm
      .get('filerCustomer')
      .valueChanges.pipe(
        tap((c) => (this.isCustomerLoading = true)),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => {
          this.customerResource.customerName = c;
          this.customerResource.id = null;
          return this.customerService.getCustomers(this.customerResource);
        })
      )
      .subscribe(
        (resp: HttpResponse<Customer[]>) => {
          this.isCustomerLoading = false;
          if (resp && resp.headers) {
            this.customers = [...resp.body];
          }
        },
        (err) => {
          this.isCustomerLoading = false;
        }
      );
  }

  getCustomers() {
    if (this.salesOrder) {
      this.customerResource.id = this.salesOrder.customerId;
    } else {
      this.customerResource.customerName = '';
      this.customerResource.id = null;
    }
    this.customerService
      .getCustomers(this.customerResource)
      .subscribe((resp) => {
        if (resp && resp.headers) {
          this.customers = [...resp.body];
          const walkInCustomer = this.customers.find((c) => c.isWalkIn);
          if (!walkInCustomer) {
            this.getWalkinCustomer();
          } else {
            this.salesOrderForm.get('customerId').setValue(walkInCustomer.id);
          }
        }
      });
  }

  getWalkinCustomer() {
    this.customerService.getWalkInCustomer().subscribe((c) => {
      if (c) {
        this.customers.push(c);
        this.salesOrderForm.get('customerId').setValue(c.id);
      }
    });
  }

  onSaveAndNew() {
    this.onSalesOrderSubmit(true);
  }

  onSalesOrderSubmit(isSaveAndNew = false) {
    if (!this.salesOrderForm.valid) {
      this.salesOrderForm.markAllAsTouched();
    } else {
      const salesOrder = this.buildSalesOrder();
      let salesOrderItems = this.salesOrderForm.get('salesOrderItems').value;
      if (salesOrderItems && salesOrderItems.length == 0) {
        this.toastrService.error(
          this.translationService.getValue('PLEASE_SELECT_ATLEASE_ONE_PRODUCT')
        );
      } else {
        this.salesOrderService
          .addSalesOrder(salesOrder)
          .subscribe((c: SalesOrder) => {
            this.toastrService.success(
              this.translationService.getValue('SALES_ORDER_ADDED_SUCCESSFULLY')
            );
            if (isSaveAndNew) {
              this.router.navigate(['/pos']);
              this.ngOnInit();
            } else {
              this.router.navigate(['/sales-order/list']);
            }
          });
      }
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  buildSalesOrder() {
    const salesOrder: SalesOrder = {
      id: this.salesOrder ? this.salesOrder.id : '',
      orderNumber: this.salesOrderForm.get('orderNumber').value,
      deliveryDate: this.salesOrderForm.get('deliveryDate').value,
      deliveryStatus: DeliveryStatusEnum.UnDelivery,
      isSalesOrderRequest: false,
      soCreatedDate: this.salesOrderForm.get('soCreatedDate').value,
      salesOrderStatus: SalesOrderStatusEnum.Not_Return,
      customerId: this.salesOrderForm.get('customerId').value,
      totalAmount: this.grandTotal,
      totalDiscount: this.totalDiscount,
      totalTax: this.totalTax,
      note: this.salesOrderForm.get('note').value,
      termAndCondition: this.salesOrderForm.get('termAndCondition').value,
      salesOrderItems: [],
    };

    const salesOrderItems = this.salesOrderForm.get('salesOrderItems').value;
    if (salesOrderItems && salesOrderItems.length > 0) {
      salesOrderItems.forEach((so) => {
        salesOrder.salesOrderItems.push({
          discount: parseFloat(
            this.quantitiesUnitPriceTaxPipe.transform(
              so.quantity,
              so.unitPrice,
              so.discountPercentage
            )
          ),
          discountPercentage: so.discountPercentage,
          productId: so.productId,
          unitId: so.unitId,
          quantity: so.quantity,
          warehouseId: so.warehouseId,
          taxValue: parseFloat(
            this.quantitiesUnitPriceTaxPipe.transform(
              so.quantity,
              so.unitPrice,
              so.discountPercentage,
              so.taxValue,
              this.taxsMap[0]
            )
          ),
          unitPrice: parseFloat(so.unitPrice),
          salesOrderItemTaxes: so.taxValue
            ? [
                ...so.taxValue.map((element) => {
                  const salesOrderItemTaxes: SalesOrderItemTax = {
                    taxId: element,
                  };
                  return salesOrderItemTaxes;
                }),
              ]
            : [],
        });
      });
    }
    return salesOrder;
  }

  onSalesOrderList() {
    this.router.navigate(['/']);
  }
}

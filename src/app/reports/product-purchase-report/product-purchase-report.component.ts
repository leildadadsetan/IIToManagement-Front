import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order-item';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Supplier } from '@core/domain-classes/supplier';
import { ClonerService } from '@core/services/clone.service';
import { dateCompare } from '@core/services/date-range';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ProductService } from 'src/app/product/product.service';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { ProductPurchaseReportDataSource } from './product-purchase-report.datasource';
import * as XLSX from 'xlsx';
import { PaymentStatusPipe } from '@shared/pipes/purchase-order-paymentStatus.pipe';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';

@Component({
  selector: 'app-product-purchase-report',
  templateUrl: './product-purchase-report.component.html',
  styleUrls: ['./product-purchase-report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [UTCToLocalTime, CustomCurrencyPipe, PaymentStatusPipe]
})
export class ProductPurchaseReportComponent extends BaseComponent {
  dataSource: ProductPurchaseReportDataSource;
  purchaseOrderItems: PurchaseOrderItem[] = [];
  displayedColumns: string[] = ['productName', 'purchaseOrderNumber', 'supplierName', 'pOCreatedDate', 'unitName', 'unitPrice', 'quantity', 'totalDiscount', 'taxes', 'totalTax', 'totalAmount'];
  footerToDisplayed: string[] = ['footer'];
  isLoadingResults = true;
  purchaseOrderResource: PurchaseOrderResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _supplierFilter: string;
  _orderNumberFilter: string;
  supplierNameControl: UntypedFormControl = new UntypedFormControl();
  supplierList$: Observable<Supplier[]>;
  searchForm: UntypedFormGroup;
  currentDate: Date = new Date();
  products: Product[] = [];
  productResource: ProductResourceParameter;

  public filterObservable$: Subject<string> = new Subject<string>();

  public get SupplierFilter(): string {
    return this._supplierFilter;
  }

  public set SupplierFilter(v: string) {
    this._supplierFilter = v;
    const supplierFilter = `supplierName:${v}`;
    this.filterObservable$.next(supplierFilter);
  }

  public get OrderNumberFilter(): string {
    return this._orderNumberFilter;
  }

  public set OrderNumberFilter(v: string) {
    this._orderNumberFilter = v;
    const orderNumberFilter = `orderNumber:${v}`;
    this.filterObservable$.next(orderNumberFilter);
  }

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService,
    private cd: ChangeDetectorRef,
    private commonDialogService: CommonDialogService,
    private toastrService: ToastrService,
    private router: Router,
    public translationService: TranslationService,
    private dialog: MatDialog,
    private clonerService: ClonerService,
    private fb: UntypedFormBuilder,
    private productService: ProductService,
    private utcToLocalTime: UTCToLocalTime,
    private customCurrencyPipe: CustomCurrencyPipe) {
    super(translationService);
    this.getLangDir();
    this.productResource = new ProductResourceParameter();
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 50;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc';
    this.purchaseOrderResource.isPurchaseOrderRequest = false;
  }

  ngOnInit(): void {
    this.supplierNameControlOnChange();
    this.createSearchFormGroup();
    this.getProducts();
    this.getProductByNameValue();
    this.dataSource = new ProductPurchaseReportDataSource(this.purchaseOrderService);
    this.dataSource.loadData(this.purchaseOrderResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.purchaseOrderResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'supplierName') {
          this.purchaseOrderResource.supplierName = strArray[1];
        } else if (strArray[0] === 'orderNumber') {
          this.purchaseOrderResource.orderNumber = strArray[1];
        }
        this.dataSource.loadData(this.purchaseOrderResource);
      });
  }

  createSearchFormGroup() {
    this.searchForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      filterProductValue: [''],
      productId: ['']
    }, {
      validators: dateCompare()
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.purchaseOrderResource.fromDate = this.searchForm.get('fromDate').value;
      this.purchaseOrderResource.toDate = this.searchForm.get('toDate').value;
      this.purchaseOrderResource.productId = this.searchForm.get('productId').value;
      this.dataSource.loadData(this.purchaseOrderResource);
    }
  }

  onClear() {
    this.searchForm.reset();
    this.purchaseOrderResource.fromDate = this.searchForm.get('fromDate').value;
    this.purchaseOrderResource.toDate = this.searchForm.get('toDate').value;
    this.purchaseOrderResource.productId = this.searchForm.get('productId').value;
    this.dataSource.loadData(this.purchaseOrderResource);
  }

  getProductByNameValue() {
    this.sub$.sink = this.searchForm.get('filterProductValue').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.productResource.name = c;
          return this.productService.getProducts(this.productResource);
        })
      ).subscribe((resp: HttpResponse<Product[]>) => {
        if (resp && resp.headers) {
          this.products = [...resp.body];
        }
      }, (err) => {

      });
  }

  getProducts() {
    this.productResource.name = '';
    return this.productService.getProducts(this.productResource)
      .subscribe((resp: HttpResponse<Product[]>) => {
        if (resp && resp.headers) {
          this.products = [...resp.body];
        }
      }, (err) => {

      });;
  }


  supplierNameControlOnChange() {
    this.supplierList$ = this.supplierNameControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(c => {
        return this.supplierService.getSuppliersForDropDown(c);
      })
    );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.purchaseOrderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.purchaseOrderResource.pageSize = this.paginator.pageSize;
          this.purchaseOrderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.purchaseOrderResource);
        })
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.purchaseOrderResource.pageSize = c.pageSize;
          this.purchaseOrderResource.skip = c.skip;
          this.purchaseOrderResource.totalCount = c.totalCount;
        }
      });
  }

  onDownloadReport() {
    this.purchaseOrderService.getAllPurchaseOrderItemReport(this.purchaseOrderResource)
      .subscribe((c: HttpResponse<PurchaseOrderItem[]>) => {
        this.purchaseOrderItems = [...c.body];
        let heading = [[
          this.translationService.getValue('PRODUCT_NAME'),
          this.translationService.getValue('ORDER_NUMBER'),
          this.translationService.getValue('SUPPLIER'),
          this.translationService.getValue('PURCHASE_DATE'),
          this.translationService.getValue('UNIT'),
          this.translationService.getValue('UNIT_PER_PRICE'),
          this.translationService.getValue('QUANTITY'),
          this.translationService.getValue('TOTAL_DISCOUNT'),
          this.translationService.getValue('TAX'),
          this.translationService.getValue('TOTAL_TAX'),
          this.translationService.getValue('TOTAL')
        ]];

        let purchaseOrderReport = [];
        this.purchaseOrderItems.forEach((purchaseOrderItem: PurchaseOrderItem) => {
          purchaseOrderReport.push({
            'PRODUCT_NAME': purchaseOrderItem.productName,
            'ORDER_NUMBER': purchaseOrderItem.purchaseOrderNumber,
            'SUPPLIER': purchaseOrderItem.supplierName,
            'PURCHASE_DATE': this.utcToLocalTime.transform(purchaseOrderItem.poCreatedDate, 'shortDate'),
            'UNIT': purchaseOrderItem.unitName,
            'UNIT_PER_PRICE': this.customCurrencyPipe.transform(purchaseOrderItem.unitPrice),
            'QUANTITY': purchaseOrderItem.quantity,
            'TOTAL_DISCOUNT': this.customCurrencyPipe.transform(purchaseOrderItem.discount),
            'TAX': purchaseOrderItem.purchaseOrderItemTaxes.map(c => c.taxName + '(' + c.taxPercentage + ' %)',),
            'TOTAL_TAX': this.customCurrencyPipe.transform(purchaseOrderItem.taxValue),
            'TOTAL': this.customCurrencyPipe.transform((purchaseOrderItem.unitPrice * purchaseOrderItem.quantity) - purchaseOrderItem.discount + purchaseOrderItem.taxValue)
          });
        });

        let workBook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(workBook, heading);
        let workSheet = XLSX.utils.sheet_add_json(workBook, purchaseOrderReport, { origin: "A2", skipHeader: true });
        XLSX.utils.book_append_sheet(workBook, workSheet,this.translationService.getValue('PRODUCT_PURCHASE_REPORT'));
        XLSX.writeFile(workBook,this.translationService.getValue('PRODUCT_PURCHASE_REPORT') + ".xlsx");
      });
  }
}

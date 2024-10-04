import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Supplier } from '@core/domain-classes/supplier';
import { ClonerService } from '@core/services/clone.service';
import { dateCompare } from '@core/services/date-range';
import { TranslationService } from '@core/services/translation.service';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ProductService } from 'src/app/product/product.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import * as XLSX from 'xlsx';
import { SalesOrderItem } from '@core/domain-classes/sales-order-item';
import { ProductSalesReportDataSource } from './product-sales-report.datasource';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { SalesOrderService } from 'src/app/sales-order/sales-order.service';
import { PaymentStatusPipe } from '@shared/pipes/purchase-order-paymentStatus.pipe';
import { Customer } from '@core/domain-classes/customer';
import { CustomerService } from 'src/app/customer/customer.service';

@Component({
  selector: 'app-product-sales-report',
  templateUrl: './product-sales-report.component.html',
  styleUrls: ['./product-sales-report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [UTCToLocalTime, CustomCurrencyPipe, PaymentStatusPipe]
})
export class ProductSalesReportComponent extends BaseComponent {
  dataSource: ProductSalesReportDataSource;
  salesOrderItems: SalesOrderItem[] = [];
  displayedColumns: string[] = ['productName', 'salesOrderNumber', 'customerName', 'sOCreatedDate', 'unitName', 'unitPrice', 'quantity', 'totalDiscount', 'taxes', 'totalTax', 'totalAmount'];
  footerToDisplayed: string[] = ['footer'];
  isLoadingResults = true;
  salesOrderResource: SalesOrderResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _customerFilter: string;
  _orderNumberFilter: string;
  customerNameControl: UntypedFormControl = new UntypedFormControl();
  customerList$: Observable<Customer[]>;
  searchForm: UntypedFormGroup;
  currentDate: Date = new Date();
  products: Product[] = [];
  productResource: ProductResourceParameter;

  public filterObservable$: Subject<string> = new Subject<string>();

  public get CustomerFilter(): string {
    return this._customerFilter;
  }

  public set CustomerFilter(v: string) {
    this._customerFilter = v;
    const customerFilter = `customerName:${v}`;
    this.filterObservable$.next(customerFilter);
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
    private salesOrderService: SalesOrderService,
    private customerService: CustomerService,
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
    this.salesOrderResource = new SalesOrderResourceParameter();
    this.salesOrderResource.pageSize = 50;
    this.salesOrderResource.orderBy = 'soCreatedDate asc';
    this.salesOrderResource.isSalesOrderRequest = false;
  }

  ngOnInit(): void {
    this.customerNameControlOnChange();
    this.createSearchFormGroup();
    this.getProducts();
    this.getProductByNameValue();
    this.dataSource = new ProductSalesReportDataSource(this.salesOrderService);
    this.dataSource.loadData(this.salesOrderResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.salesOrderResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'customerName') {
          this.salesOrderResource.customerName = strArray[1];
        } else if (strArray[0] === 'orderNumber') {
          this.salesOrderResource.orderNumber = strArray[1];
        }
        this.dataSource.loadData(this.salesOrderResource);
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
      this.salesOrderResource.fromDate = this.searchForm.get('fromDate').value;
      this.salesOrderResource.toDate = this.searchForm.get('toDate').value;
      this.salesOrderResource.productId = this.searchForm.get('productId').value;
      this.dataSource.loadData(this.salesOrderResource);
    }
  }

  onClear() {
    this.searchForm.reset();
    this.salesOrderResource.fromDate = this.searchForm.get('fromDate').value;
    this.salesOrderResource.toDate = this.searchForm.get('toDate').value;
    this.salesOrderResource.productId = this.searchForm.get('productId').value;
    this.dataSource.loadData(this.salesOrderResource);
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


  customerNameControlOnChange() {
    this.customerList$ = this.customerNameControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(c => {
        return this.customerService.getCustomersForDropDown('CustomerName', c);
      })
    );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.salesOrderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.salesOrderResource.pageSize = this.paginator.pageSize;
          this.salesOrderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.salesOrderResource);
        })
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.salesOrderResource.pageSize = c.pageSize;
          this.salesOrderResource.skip = c.skip;
          this.salesOrderResource.totalCount = c.totalCount;
        }
      });
  }

  onDownloadReport() {
    this.salesOrderService.getSalesOrderItemReport(this.salesOrderResource)
      .subscribe((c: HttpResponse<SalesOrderItem[]>) => {
        this.salesOrderItems = [...c.body];
        let heading = [[
          this.translationService.getValue('PRODUCT_NAME'),
          this.translationService.getValue('ORDER_NUMBER'),
          this.translationService.getValue('CUSTOMER'),
          this.translationService.getValue('SALES_DATE'),
          this.translationService.getValue('UNIT'),
          this.translationService.getValue('UNIT_PER_PRICE'),
          this.translationService.getValue('QUANTITY'),
          this.translationService.getValue('TOTAL_DISCOUNT'),
          this.translationService.getValue('TAX'),
          this.translationService.getValue('TOTAL_TAX'),
          this.translationService.getValue('TOTAL')
        ]];

        let salesOrderReport = [];
        this.salesOrderItems.forEach((salesOrderItem: SalesOrderItem) => {
          salesOrderReport.push({
            'PRODUCT_NAME': salesOrderItem.productName,
            'ORDER_NUMBER': salesOrderItem.salesOrderNumber,
            'CUSTOMER': salesOrderItem.customerName,
            'SALES_DATE': this.utcToLocalTime.transform(salesOrderItem.soCreatedDate, 'shortDate'),
            'UNIT': salesOrderItem.unitName,
            'UNIT_PER_PRICE': this.customCurrencyPipe.transform(salesOrderItem.unitPrice),
            'QUANTITY': salesOrderItem.quantity,
            'TOTAL_DISCOUNT': this.customCurrencyPipe.transform(salesOrderItem.discount),
            'TAX': salesOrderItem.salesOrderItemTaxes.map(c => c.taxName + '(' + c.taxPercentage + ' %)',),
            'TOTAL_TAX': this.customCurrencyPipe.transform(salesOrderItem.taxValue),
            'TOTAL': this.customCurrencyPipe.transform((salesOrderItem.unitPrice * salesOrderItem.quantity) - salesOrderItem.discount + salesOrderItem.taxValue)
          });
        });

        let workBook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(workBook, heading);
        let workSheet = XLSX.utils.sheet_add_json(workBook, salesOrderReport, { origin: "A2", skipHeader: true });
        XLSX.utils.book_append_sheet(workBook, workSheet,this.translationService.getValue('PRODUCT_SALES_REPORT'));
        XLSX.writeFile(workBook,this.translationService.getValue('PRODUCT_SALES_REPORT') +".xlsx");
      });
  }
}

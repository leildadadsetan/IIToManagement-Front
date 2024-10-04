import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Customer } from '@core/domain-classes/customer';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { ClonerService } from '@core/services/clone.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { CustomerService } from 'src/app/customer/customer.service';
import { AddSalesOrderPaymentComponent } from '../add-sales-order-payment/add-sales-order-payment.component';
import { SalesOrderDataSource } from '../sales-order-datasource';
import { SalesOrderService } from '../sales-order.service';
import { ViewSalesOrderPaymentComponent } from '../view-sales-order-payment/view-sales-order-payment.component';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SalesOrderListComponent extends BaseComponent implements OnInit {
  dataSource: SalesOrderDataSource;
  salesOrders: SalesOrder[] = [];
  displayedColumns: string[] = ['action', 'soCreatedDate', 'orderNumber', 'deliveryDate', 'customerName', 'totalDiscount', 'totalTax', 'totalAmount','totalPaidAmount', 'paymentStatus','status'];
  filterColumns: string[] = ['action-search', 'soCreatedDate-search', 'orderNumber-search', 'deliverDate-search', 'customer-search', 'totalAmount-search', 'totalDiscount-search', 'totalTax-search','totalPaidAmount-search', 'paymentStatus-search', 'status-search'];
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
  expandedElement: SalesOrder | null;
  public filterObservable$: Subject<string> = new Subject<string>();
  salesOrderForInvoice: SalesOrder;

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
    private clonerService: ClonerService) {
    super(translationService);
    this.getLangDir();
    this.salesOrderResource = new SalesOrderResourceParameter();
    this.salesOrderResource.pageSize = 50;
    this.salesOrderResource.orderBy = 'soCreatedDate asc'
  }

  ngOnInit(): void {
    this.customerNameControlOnChange();
    this.dataSource = new SalesOrderDataSource(this.salesOrderService);
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

  toggleRow(element: SalesOrder) {
    this.expandedElement = this.expandedElement === element ? null : element;
    this.cd.detectChanges();
  }

  deleteSalesOrder(salesOrder: SalesOrder) {
    this.commonDialogService.deleteConformationDialog(this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .subscribe((isYes) => {
        if (isYes) {
          this.salesOrderService.deleteSalesOrder(salesOrder.id).subscribe(() => {
            this.toastrService.success(this.translationService.getValue('SALES_ORDER_DELETED_SUCCESSFULLY'))
            this.dataSource.loadData(this.salesOrderResource);
          });
        }
      });
  }

  addPayment(salesOrder: SalesOrder): void {
    const dialogRef = this.dialog.open(AddSalesOrderPaymentComponent, {
      width: '100vh',
      direction:this.langDir,
      data: Object.assign({}, salesOrder)
    });
    dialogRef.afterClosed().subscribe((isAdded: boolean) => {
      if (isAdded) {
        this.dataSource.loadData(this.salesOrderResource);
      }
    })
  }

  viewPayment(salesOrder: SalesOrder) {
    const dialogRef = this.dialog.open(ViewSalesOrderPaymentComponent, {
      data: Object.assign({}, salesOrder), direction:this.langDir,
    });
    dialogRef.afterClosed().subscribe((isAdded: boolean) => {
      if (isAdded) {
        this.dataSource.loadData(this.salesOrderResource);
      }
    })
  }

  onSaleOrderReturn(saleOrder: SalesOrder){
    this.router.navigate(['sales-order-return', saleOrder.id]);
  }


  generateInvoice(so: SalesOrder) {
    let soForInvoice = this.clonerService.deepClone<SalesOrder>(so);
    const getCustomerRequest = this.customerService.getCustomer(so.customerId);
    const getSalesOrderItems = this.salesOrderService.getSalesOrderItems(so.id);
    forkJoin({ getCustomerRequest, getSalesOrderItems }).subscribe(response => {
      soForInvoice.customer = response.getCustomerRequest;
      soForInvoice.salesOrderItems = response.getSalesOrderItems;
      this.salesOrderForInvoice = soForInvoice;
    });
  }

}

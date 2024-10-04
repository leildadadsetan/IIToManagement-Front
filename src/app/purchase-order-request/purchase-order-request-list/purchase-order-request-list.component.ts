import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Supplier } from '@core/domain-classes/supplier';
import { ClonerService } from '@core/services/clone.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { PurchaseOrderRequestDataSource } from './purchase-order-request-datasource';

@Component({
  selector: 'app-purchase-order-request-list',
  templateUrl: './purchase-order-request-list.component.html',
  styleUrls: ['./purchase-order-request-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PurchaseOrderRequestListComponent extends BaseComponent {
  dataSource: PurchaseOrderRequestDataSource;
  purchaseOrders: PurchaseOrder[] = [];
  displayedColumns: string[] = ['action', 'poCreatedDate', 'orderNumber', 'deliveryDate', 'supplierName', 'totalAmount', 'totalDiscount', 'totalTax'];
  filterColumns: string[] = ['action-search', 'poCreatedDate-search', 'orderNumber-search', 'deliverDate-search', 'supplier-search', 'totalAmount-search', 'totalDiscount-search', 'totalTax-search'];
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
  expandedElement: PurchaseOrder | null;
  public filterObservable$: Subject<string> = new Subject<string>();

  purchaseOrderForInvoice: PurchaseOrder;
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
    private cloneService: ClonerService) {
    super(translationService);
    this.getLangDir();
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 50;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc';
    this.purchaseOrderResource.isPurchaseOrderRequest = true;
  }

  ngOnInit(): void {
    this.supplierNameControlOnChange();
    this.dataSource = new PurchaseOrderRequestDataSource(this.purchaseOrderService);
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

  convertToPurchaseOrder(purchaseOrder: PurchaseOrder) {
    this.router.navigate(['purchase-order/add'], { queryParams: { 'purchase-order-requestId': purchaseOrder.id } });
  }

  onDetailPurchaseOrder(purchaseOrder: PurchaseOrder) {
    this.router.navigate(['/purchase-order-request', purchaseOrder.id]);
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

  toggleRow(element: PurchaseOrder) {
    this.expandedElement = this.expandedElement === element ? null : element;
    this.cd.detectChanges();
  }

  poChangeEvent(purchaseOrder: PurchaseOrder) {
    this.toggleRow(purchaseOrder);
  }

  deletePurchaseOrder(purchaseOrder: PurchaseOrder) {
    this.commonDialogService.deleteConformationDialog(this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .subscribe((isYes) => {
        if (isYes) {
          this.purchaseOrderService.deletePurchaseOrder(purchaseOrder.id).subscribe(() => {
            this.toastrService.success(this.translationService.getValue('PURCHASE_ORDER_REQUEST_DELETED'))
            this.dataSource.loadData(this.purchaseOrderResource);
          });
        }
      });
  }

  generateInvoice(po: PurchaseOrder) {
    let poForInvoice = this.cloneService.deepClone<PurchaseOrder>(po);
    const getSupplierRequest = this.supplierService.getSupplier(po.supplierId);
    const getPurchaseOrderItems = this.purchaseOrderService.getPurchaseOrderItems(po.id);
    forkJoin({ getSupplierRequest, getPurchaseOrderItems }).subscribe(response => {
      poForInvoice.supplier = response.getSupplierRequest;
      poForInvoice.purchaseOrderItems = response.getPurchaseOrderItems;
      this.purchaseOrderForInvoice = poForInvoice;
    });
  }
}


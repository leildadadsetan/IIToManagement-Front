import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Expense } from '@core/domain-classes/expense';
import { ExpenseCategory } from '@core/domain-classes/expense-category';
import { ExpenseResourceParameter } from '@core/domain-classes/expense-source-parameter';
import { ProfitLoss } from '@core/domain-classes/profitLoss';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { dateCompare } from '@core/services/date-range';
import { ExpenseCategoryService } from '@core/services/expense-category.service';
import { TranslationService } from '@core/services/translation.service';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ExpenseService } from 'src/app/expense/expense.service';
import { UserService } from 'src/app/user/user.service';
import * as XLSX from 'xlsx';
import { ExpenseReportDataSource } from '../expense-report/expense-report.datasource';
import { ProfitLossReportService } from './profit-loss-report.service';

@Component({
  selector: 'app-profit-loss-report',
  templateUrl: './profit-loss-report.component.html',
  styleUrls: ['./profit-loss-report.component.scss'],
  providers:[UTCToLocalTime, CustomCurrencyPipe]
})
export class ProfitLossReportComponent extends BaseComponent implements OnInit {
  saleOrderResource: SalesOrderResourceParameter;
  purchaseOrderResource: PurchaseOrderResourceParameter;
  saleOrderProfitLoss: ProfitLoss;
  purchaseOrderProfitLoss:ProfitLoss;
  searchForm: UntypedFormGroup;
  totalAmount: number=0;
  fromDate:Date;
  toDate:Date;

  
  currentDate: Date=new Date();

  constructor(
    private expenseService: ExpenseService,
    private toastrService: ToastrService,
    public translationService: TranslationService,
    private profitLossReportService: ProfitLossReportService,
    private fb: UntypedFormBuilder,
    private utcToLocalTime: UTCToLocalTime,
    private customCurrencyPipe: CustomCurrencyPipe,
    ) {
    super(translationService);
    this.getLangDir();
    this.saleOrderResource = new SalesOrderResourceParameter();
    this.saleOrderResource.pageSize = 15;
    this.saleOrderResource.orderBy = 'createdDate asc';
  }

  ngOnInit(): void {
    this.createSearchFormGroup();
    this.searchForm.get('fromDate').setValue(new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),this.currentDate.getDate() - 30));
    this.searchForm.get('toDate').setValue(this.currentDate);
    this.saleOrderResource.fromDate= this.searchForm.get('fromDate').value;
    this.saleOrderResource.toDate= this.searchForm.get('toDate').value;
    this.getSaleOrderProfiteLoss(this.saleOrderResource);
    this.getPurchaseProfitLoss(this.saleOrderResource);
  }


  createSearchFormGroup(){
    this.searchForm= this.fb.group({
      fromDate:[''],
      toDate:['']
    },{
      validators: dateCompare()
    });
  }

  onSearch(){
   if( this.searchForm.valid){
    this.saleOrderResource.fromDate= this.searchForm.get('fromDate').value;
    this.saleOrderResource.toDate= this.searchForm.get('toDate').value;
    this.getSaleOrderProfiteLoss(this.saleOrderResource);
    this.getPurchaseProfitLoss(this.saleOrderResource);
   }
  }

  onClear(){
    this.searchForm.reset();
    this.saleOrderResource.fromDate= this.searchForm.get('fromDate').value;
    this.saleOrderResource.toDate= this.searchForm.get('toDate').value;
    this.getSaleOrderProfiteLoss(this.saleOrderResource)
  }

  getSaleOrderProfiteLoss(saleOrderResource: SalesOrderResourceParameter) {
    this.profitLossReportService.getSaleOrderProfitLoss(saleOrderResource).subscribe((resp:ProfitLoss) => {
      if (resp) {
        this.saleOrderProfitLoss = resp;
      }
    });
  }

  getPurchaseProfitLoss(saleOrderResource: SalesOrderResourceParameter){
    this.profitLossReportService.getPurchaseProfitLoss(saleOrderResource).subscribe((resp:ProfitLoss) => {
      if (resp) {
        this.purchaseOrderProfitLoss = resp;
      }
    });
  }

  onDownloadReport() {
      let heading=[[ this.translationService.getValue('TOTAL_PURCHASE'), 
      this.translationService.getValue('TOTAL_PURCHASE_TAX'), 
      this.translationService.getValue('TOTAL_DISCOUNT_ON_PURCHASE'), 
      this.translationService.getValue('PAID_PAYMENT'), 
      this.translationService.getValue('PURCHASE_DUE'),
      this.translationService.getValue('GROSS_TOTAL')]];

      let expensesReport= [];
          expensesReport.push({
            'Total Purchase': this.customCurrencyPipe.transform(this.purchaseOrderProfitLoss?.total -this.purchaseOrderProfitLoss?.totalTax + this.purchaseOrderProfitLoss?.totalDiscount),
            'Total Purchase Tax':this.customCurrencyPipe.transform(this.purchaseOrderProfitLoss.totalTax),
            'Total Discount on Purchase': this.customCurrencyPipe.transform(this.purchaseOrderProfitLoss?.totalDiscount),
            'Paid Payment':this.customCurrencyPipe.transform(this.purchaseOrderProfitLoss.paidPayment),
            'Purchase Due': this.customCurrencyPipe.transform(this.purchaseOrderProfitLoss?.total -this.purchaseOrderProfitLoss?.paidPayment),
            'Gross Total':this.customCurrencyPipe.transform(this.purchaseOrderProfitLoss?.total),

          });
      let workBook= XLSX.utils.book_new();
      XLSX.utils.sheet_add_aoa(workBook,heading);
      let workSheet= XLSX.utils.sheet_add_json(workBook, expensesReport, {origin: "A2", skipHeader:true });
      XLSX.utils.book_append_sheet(workBook,workSheet,this.translationService.getValue('PURCHASE_PROFIT_&LOSS_REPORT'));
      XLSX.writeFile(workBook,this.translationService.getValue('PURCHASE_PROFIT_&LOSS_REPORT') + ".xlsx");
  }

  onSaleDownloadReport() {
    let heading=[[ this.translationService.getValue('TOTAL_SALES'), 
    this.translationService.getValue('TOTAL_SALES_TAX'), 
    this.translationService.getValue('TOTAL_DISCOUNT_ON_SALES'), 
    this.translationService.getValue('PAID_PAYMENT'), 
    this.translationService.getValue('SALES_DUE'),
    this.translationService.getValue('GROSS_TOTAL')]];

    let expensesReport= [];
        expensesReport.push({
          'Total Sales': this.customCurrencyPipe.transform(this.saleOrderProfitLoss?.total -this.saleOrderProfitLoss?.totalTax + this.saleOrderProfitLoss?.totalDiscount),
          'Total Sales Tax':this.customCurrencyPipe.transform(this.saleOrderProfitLoss.totalTax),
          'Total Discount on Sales': this.customCurrencyPipe.transform(this.saleOrderProfitLoss?.totalDiscount),
          'Paid Payment':this.customCurrencyPipe.transform(this.saleOrderProfitLoss.paidPayment),
          'Sales Due': this.customCurrencyPipe.transform(this.saleOrderProfitLoss?.total -this.saleOrderProfitLoss?.paidPayment),
          'Gross Total':this.customCurrencyPipe.transform(this.saleOrderProfitLoss?.total),

        });
    let workBook= XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(workBook,heading);
    let workSheet= XLSX.utils.sheet_add_json(workBook, expensesReport, {origin: "A2", skipHeader:true });
    XLSX.utils.book_append_sheet(workBook,workSheet,this.translationService.getValue('SALES_PROFIT_&LOSS_REPORT'));
    XLSX.writeFile(workBook,this.translationService.getValue('SALES_PROFIT_&LOSS_REPORT') + ".xlsx");
}
}

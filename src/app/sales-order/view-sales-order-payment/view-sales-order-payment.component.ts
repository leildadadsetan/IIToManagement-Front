import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderPayment } from '@core/domain-classes/sales-order-payment';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { SalesOrderPaymentService } from '../sales-order-payment.service';

@Component({
  selector: 'app-view-sales-order-payment',
  templateUrl: './view-sales-order-payment.component.html',
  styleUrls: ['./view-sales-order-payment.component.scss']
})
export class ViewSalesOrderPaymentComponent extends BaseComponent implements OnInit {
  dataSource = new MatTableDataSource<SalesOrderPayment>();
  isData: boolean = false;
  isDeleted = false;
  constructor(
    public dialogRef: MatDialogRef<ViewSalesOrderPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SalesOrder,
    private salesOrderPaymentService: SalesOrderPaymentService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    if (this.data.id) {
      this.getAllSalesOrderPaymentById();
    }
  }

  displayedColumns: string[] = ['action', 'paymentDate', 'referenceNumber', 'amount', 'paymentMethod'];
  footerToDisplayed = ['footer']

  onCancel(): void {
    this.dialogRef.close(this.isDeleted);
  }

  getAllSalesOrderPaymentById() {
    this.salesOrderPaymentService.getAllSalesOrderPaymentById(this.data.id).subscribe(data => {
      this.dataSource = data;
      if (data.length == 0) {
        this.isData = true;
      }
    });
  }

  deletePayment(payment: SalesOrderPayment) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${payment.amount}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.salesOrderPaymentService.deleteSalesOrderPayment(payment.id)
            .subscribe(() => {
              this.isDeleted = true;
              this.toastrService.success(this.translationService.getValue('PAYMENT_IS_DELETED'));
              this.getAllSalesOrderPaymentById();
            });
        }
      });
  }
}

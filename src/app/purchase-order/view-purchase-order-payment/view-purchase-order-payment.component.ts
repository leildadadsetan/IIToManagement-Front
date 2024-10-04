import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { PurchaseOrderPayment } from '@core/domain-classes/purchase-order-payment';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderPaymentService } from '../purchase-order-payment.service';

@Component({
  selector: 'app-view-purchase-order-payment',
  templateUrl: './view-purchase-order-payment.component.html',
  styleUrls: ['./view-purchase-order-payment.component.scss']
})
export class ViewPurchaseOrderPaymentComponent extends BaseComponent implements OnInit {
  dataSource = new MatTableDataSource<PurchaseOrderPayment>();
  isData: boolean = false;
  isDeleted = false;
  constructor(
    public dialogRef: MatDialogRef<ViewPurchaseOrderPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PurchaseOrder,
    private purchaseOrderPaymentService: PurchaseOrderPaymentService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    if (this.data.id) {
      this.getAllPurchaseOrderPaymentById();
    }
  }

  displayedColumns: string[] = ['action', 'paymentDate', 'referenceNumber', 'amount', 'paymentMethod'];
  footerToDisplayed = ['footer']

  onCancel(): void {
    this.dialogRef.close(this.isDeleted);
  }

  getAllPurchaseOrderPaymentById() {
    this.purchaseOrderPaymentService.getAllPurchaseOrderPaymentById(this.data.id).subscribe(data => {
      this.dataSource = data;
      if (data.length == 0) {
        this.isData = true;
      }
    });
  }

  deletePayment(payment: PurchaseOrderPayment) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${payment.amount}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.purchaseOrderPaymentService.deletePurchaseOrderPayment(payment.id)
            .subscribe(() => {
              this.isDeleted = true;
              this.toastrService.success('Payment is deleted.');
              this.getAllPurchaseOrderPaymentById();
            });
        }
      });
  }

}

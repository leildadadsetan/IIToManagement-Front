import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order-item';
import { SecurityService } from '@core/security/security.service';
import { ClonerService } from '@core/services/clone.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderService } from '../purchase-order.service';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent extends BaseComponent {
  currentDate: Date = new Date();
  quantitesErrormsg: string = '';
  errorMsg: string = '';
  companyProfile: CompanyProfile;
  isLoading = false;
  isquatation: boolean = false;
  purchaseOrder: PurchaseOrder = null;
  purchaseOrderItems: PurchaseOrderItem[];
  purchaseOrderReturnsItems: PurchaseOrderItem[];
  purchaseOrderForInvoice: PurchaseOrder;
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private routes: ActivatedRoute,
    private clonerService: ClonerService,
    private toastrService: ToastrService,
    private securityService: SecurityService,
    private location: Location,
    public translationService: TranslationService) {
    super(translationService);

  }

  ngOnInit(): void {
    this.getSupplierOrderById();
    this.subScribeCompanyProfile();
  }

  getSupplierOrderById() {
    this.sub$.sink = this.routes.params.subscribe((c: Params) => {
      this.getPurchaseOrderById(c['id']);
    });
  }

  subScribeCompanyProfile() {
    this.securityService.companyProfile.subscribe(data => {
      this.companyProfile = data;
    });
  }

  getPurchaseOrderById(id: string) {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseOrderById(id)
      .subscribe((c: PurchaseOrder) => {
       // this.purchaseOrder=isquatation
        this.purchaseOrder = this.clonerService.deepClone<PurchaseOrder>(c);
        this.purchaseOrder.totalQuantity = this.purchaseOrder.purchaseOrderItems.map(item => item.status == 1 ? -1 * item.quantity : item.quantity).reduce((prev, next) => prev + next);
        this.purchaseOrderItems = this.purchaseOrder.purchaseOrderItems.filter(c => c.status == 0);
        this.purchaseOrderReturnsItems = this.purchaseOrder.purchaseOrderItems.filter(c => c.status == 1);
        this.isLoading = false;
      }, (err) => {
        this.isLoading = false;
      });
  }

  generateInvoice() {
    let poForInvoice = this.clonerService.deepClone<PurchaseOrder>(this.purchaseOrder);
    poForInvoice.purchaseOrderItems.map(c => {
      c.unitName = c.unitConversation?.name;
      return c;
    })
    this.purchaseOrderForInvoice = poForInvoice;
  }

  // calulateTax() {
  //   const totalQuantity = this.purchaseOrder.totalQuantity;
  //   const unitPrice = this.purchaseOrder.pricePerUnit;;
  //   const tax = this.purchaseOrder.tax;
  //   const totalAmountWithTax = totalQuantity * unitPrice;
  //   let totalAmount = 0;
  //   if (tax && tax !== 0) {
  //     totalAmount = totalAmountWithTax + (totalAmountWithTax * tax) / 100;
  //     totalAmount = parseFloat(totalAmount.toFixed(2));
  //   } else {
  //     if (totalAmountWithTax) {
  //       totalAmount = totalAmountWithTax;
  //     } else {
  //       totalAmount = 0;
  //     }
  //   }
  //   return totalAmount;
  // }

  // downloadAttachment(attachement: PurchaseOrderAttachment) {
  //   this.sub$.sink = this.purchaseOrderService.downloadAttachment(attachement.id)
  //     .subscribe(
  //       (event) => {
  //         if (event.type === HttpEventType.Response) {
  //           this.downloadFile(event, attachement.name);
  //         }
  //       },
  //       (error) => {
  //         this.toastrService.error(this.translationService.getValue('ERROR_WHILE_DOWNLOADING_DOCUMENT'));
  //       }
  //     );
  // }

  private downloadFile(data: HttpResponse<Blob>, name: string) {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = name;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  cancel() {
    this.location.back();
  }

}

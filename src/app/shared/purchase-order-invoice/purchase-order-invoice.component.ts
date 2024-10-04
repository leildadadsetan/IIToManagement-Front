import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order-item';
import { SecurityService } from '@core/security/security.service';

@Component({
  selector: 'app-purchase-order-invoice',
  templateUrl: './purchase-order-invoice.component.html',
  styleUrls: ['./purchase-order-invoice.component.scss']
})
export class PurchaseOrderInvoiceComponent implements OnInit, OnChanges {
  @Input() purchaseOrder: PurchaseOrder;
  isquatation: boolean = false;
  purchaseOrderForInvoice: PurchaseOrder;
  companyProfile: CompanyProfile;
  purchaseOrderItems: PurchaseOrderItem[];
  purchaseOrderReturnsItems: PurchaseOrderItem[];

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    this.subScribeCompanyProfile();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['purchaseOrder']) {
      this.isquatation = this.purchaseOrder.isPurchaseOrderRequest;
      this.purchaseOrder.totalQuantity = this.purchaseOrder.purchaseOrderItems.map(item => item.status == 0 ? item.quantity : (-1) * item.quantity).reduce((prev, next) => prev + next);
      this.purchaseOrderItems = this.purchaseOrder.purchaseOrderItems.filter(c => c.status == 0);
      this.purchaseOrderReturnsItems = this.purchaseOrder.purchaseOrderItems.filter(c => c.status == 1);
      this.purchaseOrderForInvoice = this.purchaseOrder;
      this.purchaseOrder = null;
    }
    setTimeout(() => {
      this.printInvoice();
    }, 1000);
  }

  subScribeCompanyProfile() {
    
    this.securityService.companyProfile.subscribe(data => {
      this.companyProfile = data;
    });
  }

  printInvoice() {
    let name = this.purchaseOrderForInvoice.orderNumber;
    let printContents, popupWin;
    printContents = document.getElementById('purchaseOrderInvoice').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>${name}</title>
            <style>
            @page { size: auto;  margin: 0mm;  margin-top:60px; }

            @media print {
              * {
                font-family: "Hind-Vadodara", sans-serif;
                -webkit-print-color-adjust: exact;
              }
            }
            tr{
              border: 1px solid #000;
              border-spacing: 2px;
              
            }
            table {
              border-collapse: collapse;
            }
            th, td {
              padding: 5px;
            }
            </style>
            <script>
            function loadHandler(){

            var is_chrome = function () { return Boolean(window.chrome); }
        if(is_chrome)
        {
           window.print();
           setTimeout(function(){window.close();}, 1000);
           //give them 10 seconds to print, then close
        }
        else
        {
           window.print();
           window.close();
        }
        }
        </script>
          </head>
      <body onload="loadHandler()">${printContents}</body>
        </html>
    `
    );
    popupWin.document.close();
  }

}

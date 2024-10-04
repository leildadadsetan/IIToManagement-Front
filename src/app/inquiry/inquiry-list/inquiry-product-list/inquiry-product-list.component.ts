import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inquiry } from '@core/domain-classes/inquiry';
import { InquiryProduct } from '@core/domain-classes/inquiry-product';
import { Product } from '@core/domain-classes/product';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { InquiryService } from '../../inquiry.service';

@Component({
  selector: 'app-inquiry-product-list',
  templateUrl: './inquiry-product-list.component.html',
  styleUrls: ['./inquiry-product-list.component.scss']
})
export class InquiryProductListComponent extends BaseComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;
  displayedColumns = ['name', 'brand', 'category', 'salesPrice', 'purchasePrice', 'mrp'];
  constructor(
    private inquiryService: InquiryService,
    public dialogRef: MatDialogRef<InquiryProductListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inquiry,
    public translationService:TranslationService,
    private dialog: MatDialog) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    if (this.data) {
      this.getProductsList();
    }
  }

  getProductsList() {
    this.isLoading = true;
    this.sub$.sink = this.inquiryService
      .getProductsByInquiryId(this.data.id)
      .subscribe((c) => {
        this.products = c;
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

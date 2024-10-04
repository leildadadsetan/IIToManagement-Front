import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ProductCategory } from '@core/domain-classes/product-category';
import { ProductCategoryService } from '@core/services/product-category.service';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageProductCategoryComponent } from '../manage-product-category/manage-product-category.component';

@Component({
  selector: 'app-product-category-list-presentation',
  templateUrl: './product-category-list-presentation.component.html',
  styleUrls: ['./product-category-list-presentation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductCategoryListPresentationComponent extends BaseComponent implements OnInit {
  @Input() productCategories: ProductCategory[];
  @Output() addEditCategoryHandler: EventEmitter<ProductCategory> = new EventEmitter<ProductCategory>();
  @Output() deleteProductCategoryHandler: EventEmitter<string> = new EventEmitter<string>();
  columnsToDisplay: string[] = ['subcategory', 'action', 'name', 'description'];
  subCategoryColumnToDisplay: string[] = ['action', 'name', 'description'];
  subCategories: ProductCategory[] = [];
  expandedElement: ProductCategory | null;
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    private cd: ChangeDetectorRef,
    private productCategoryService: ProductCategoryService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
  }

  toggleRow(element: ProductCategory) {
    this.subCategories = [];
    this.productCategoryService.getSubCategories(element.id).subscribe(subCat => {
      this.subCategories = subCat;
      this.expandedElement = this.expandedElement === element ? null : element;
      this.cd.detectChanges();
    });
  }

  deleteCategory(category: ProductCategory): void {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${category.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteProductCategoryHandler.emit(category.id);
        }
      });
  }

  manageCategory(category: ProductCategory): void {
    const dialogRef = this.dialog.open(ManageProductCategoryComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, category)
    });

    this.sub$.sink = dialogRef.afterClosed()
      .subscribe((result: ProductCategory) => {
        if (result) {
          this.addEditCategoryHandler.emit(result);
        }
      });
  }

  addSubCategory(category: ProductCategory) {
    this.manageCategory({
      id: '',
      description: '',
      name: '',
      parentId: category.id
    });
  }
}

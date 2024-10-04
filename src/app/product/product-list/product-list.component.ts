import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Brand } from '@core/domain-classes/brand';
import { Product } from '@core/domain-classes/product';
import { ProductCategory } from '@core/domain-classes/product-category';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Unit } from '@core/domain-classes/unit';
import { BrandService } from '@core/services/brand.service';
import { ProductCategoryService } from '@core/services/product-category.service';
import { TranslationService } from '@core/services/translation.service';
import { UnitService } from '@core/services/unit.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { UnitConversationService } from 'src/app/unit-conversation/unit-conversation.service';
import { ProductService } from '../product.service';
import { GenerateBarcodeComponent } from './generate-barcode/generate-barcode.component';
import { ProductDataSource } from './product-datasource';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends BaseComponent implements OnInit {
  dataSource: ProductDataSource;
  displayedColumns: string[] = ['action', 'imageUrl', 'name', 'brandName', 'categoryName', 'unitName', 'purchasePrice', 'salesPrice', 'mrp', 'warehouse'];
  searchColumns: string[] = ['action-search', 'imageUrl-search', 'name-search', 'brandName-search', 'categoryName-search', 'unitName-search', 'purchasePrice-search',
    'salesPrice-search', 'mrp-search', 'warehouse-search'];
  footerToDisplayed = ['footer'];
  brands: Brand[] = [];
  allCategories: ProductCategory[] = [];
  productCategories: ProductCategory[] = [];
  units: Unit[] = [];
  isLoadingResults = true;
  productResource: ProductResourceParameter;
  product: Product;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _nameFilter: string;
  _brandFilter: string;
  _unitFilter: string;
  _categoryFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();
  baseUrl = environment.apiUrl;

  public get NameFilter(): string {
    return this._nameFilter;
  }

  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `name:${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public set BrandFilter(v: string) {
    this._brandFilter = v ? v : '';
    const brandFilter = `brandId:${this._brandFilter}`;
    this.filterObservable$.next(brandFilter);
  }
  public get BrandFilter(): string {
    return this._brandFilter;
  }

  public set UnitFilter(v: string) {
    this._unitFilter = v ? v : '';
    const unitFilter = `unitId:${this._unitFilter}`;
    this.filterObservable$.next(unitFilter);
  }
  public get UnitFilter(): string {
    return this._unitFilter;
  }

  public set CategoryFilter(v: string) {
    this._categoryFilter = v ? v : '';
    const categoryFilter = `categoryId:${this._categoryFilter}`;
    this.filterObservable$.next(categoryFilter);
  }
  public get CategoryFilter(): string {
    return this._categoryFilter;
  }

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private brandService: BrandService,
    private unitConversationService: UnitConversationService,
    private dialog: MatDialog,
    public translationService: TranslationService,
    private commonDialogService: CommonDialogService,
    private toastrService: ToastrService) {
    super(translationService);
    this.getLangDir();
    this.productResource = new ProductResourceParameter();
    this.productResource.pageSize = 15;
    this.productResource.orderBy = 'createdDate desc';
  }

  ngOnInit(): void {
    this.dataSource = new ProductDataSource(this.productService);
    this.dataSource.loadData(this.productResource);
    this.getResourceParameter();
    this.getBrands();
    this.getProductCategories();
    this.getUnits();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.productResource.skip = 0;
        this.paginator.pageIndex = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'name') {
          this.productResource.name = strArray[1];
        }
        if (strArray[0] === 'unitId') {
          this.productResource.unitId = strArray[1];
        }
        if (strArray[0] === 'brandId') {
          this.productResource.brandId = strArray[1];
        }
        if (strArray[0] === 'categoryId') {
          this.productResource.categoryId = strArray[1];
        }
        this.dataSource.loadData(this.productResource);
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.productResource.pageSize = c.pageSize;
          this.productResource.skip = c.skip;
          this.productResource.totalCount = c.totalCount;
        }
      });
  }

  getProductCategories() {
    this.productCategoryService.getAllCategoriesForDropDown().subscribe(c => {
      this.productCategories = [...c];
      this.setDeafLevel();
    });
  }

  setDeafLevel(parent?: ProductCategory, parentId?: string) {
    const children = this.productCategories.filter(c => c.parentId == parentId);
    if (children.length > 0) {
      children.map((c, index) => {
        const object: ProductCategory = Object.assign({}, c, {
          deafLevel: parent ? parent.deafLevel + 1 : 0,
          index: (parent ? parent.index : 0) + index * Math.pow(0.1, c.deafLevel)
        })
        this.allCategories.push(object);
        this.setDeafLevel(object, object.id);
      });
    }
    return parent;
  }


  getBrands() {
    this.brandService.getAll().subscribe(b => this.brands = b);
  }

  getUnits() {
    this.unitConversationService.getUnitConversations().subscribe(units => {
      this.units = units;
    })
  }

  generateInvoice(po: Product) {
    this.product = po;

  }

  generateBarcode(product: Product): void {
    this.dialog.open(GenerateBarcodeComponent, {
      width: '110vh',
      direction: this.langDir,
      data: Object.assign({}, product)
    });
  }

  ngAfterViewInit() {
    this.sub$.sink = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.productResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.productResource.pageSize = this.paginator.pageSize;
          this.productResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.productResource);
        })
      )
      .subscribe();
  }

  deleteProduct(product: Product) {
    this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.productService.deleteProudct(product.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('PRODUCT_DELETED_SUCCESSFULLY'));
              this.paginator.pageIndex = 0;
              this.dataSource.loadData(this.productResource);
            });
        }
      });
  }
}

import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inventory } from '@core/domain-classes/inventory';
import { Product } from '@core/domain-classes/product';
import { ProductResourceParameter } from '@core/domain-classes/product-resource-parameter';
import { UnitConversation } from '@core/domain-classes/unit-conversation';
import { Warehouse } from '@core/domain-classes/warehouse';
import { TranslationService } from '@core/services/translation.service';
import { WarehouseService } from '@core/services/warehouse.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ProductService } from 'src/app/product/product.service';
import { UnitConversationService } from 'src/app/unit-conversation/unit-conversation.service';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-manage-inventory',
  templateUrl: './manage-inventory.component.html',
  styleUrls: ['./manage-inventory.component.scss'],
})
export class ManageInventoryComponent extends BaseComponent implements OnInit {
  inventoryForm: UntypedFormGroup;
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  unitConversationlist: UnitConversation[] = [];
  unitConversationForproduct: UnitConversation[] = [];
  productResource: ProductResourceParameter;

  constructor(
    public dialogRef: MatDialogRef<ManageInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inventory,
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService,
    private toastrService: ToastrService,
    public translationService: TranslationService,
    private unitConversationService: UnitConversationService,
    private fb: UntypedFormBuilder,
    private productService: ProductService
  ) {
    super(translationService);
    this.getLangDir();
    this.productResource = new ProductResourceParameter();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getWarehouse();
    this.getUnitConversation();
    this.createForm();
    this.productNameChangeValue();
    if (this.data.productId) {
      this.inventoryForm.get('filerProduct').setValue(this.data.productName);
      this.inventoryForm.get('productId').setValue(this.data.productId);
      this.inventoryForm.get('unitId').setValue(this.data.unitId);
    }
  }

  createForm() {
    this.inventoryForm = this.fb.group({
      id: [''],
      stock: ['', [Validators.required, Validators.min(1)]],
      filerProduct: [],
      productName: [''],
      productId: ['', [Validators.required]],
      warehouseId: [''],
      unitId: ['', [Validators.required]],
      pricePerUnit: ['', [Validators.required]],
    });
  }

  getProducts() {
    this.productResource.name = '';
    this.productService.getProducts(this.productResource).subscribe((resp) => {
      if (resp && resp.headers) {
        this.products = [...resp.body];
      }
    });
  }

  getWarehouse() {
    this.warehouseService.getAll().subscribe((warehouses) => {
      this.warehouses = warehouses;
    });
  }

  getUnitConversation() {
    this.unitConversationService.getUnitConversations().subscribe((units) => {
      this.unitConversationlist = units;
    });
  }

  onSelectionChange(productId: any) {
    const product = this.products.find((c) => c.id === productId);
    this.unitConversationForproduct = this.unitConversationlist.filter(
      (c) => c.id == product.unitId || c.parentId == product.unitId
    );
  }

  productNameChangeValue() {
    this.sub$.sink = this.inventoryForm
      .get('filerProduct')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => {
          this.productResource.name = c;
          return this.productService.getProducts(this.productResource);
        })
      )
      .subscribe((resp: HttpResponse<Product[]>) => {
        if (resp && resp.headers) {
          this.products = [...resp.body];
          if (this.data.id) {
            this.inventoryForm.get('productId').setValue(this.data.productId);
            this.unitConversationForproduct = this.unitConversationlist.filter(
              (c) => c.id == this.data.unitId || c.parentId == this.data.unitId
            );
            this.inventoryForm.get('unitId').setValue(this.data.unitId);
          }
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addInventory(): void {
    if (!this.inventoryForm.valid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }
    const inventory: Inventory = this.inventoryForm.value;
    const product = this.products.find((c) => c.id === inventory.productId);
    inventory.unitId = product.unitId;
    this.inventoryService.addInventory(inventory).subscribe(() => {
      this.toastrService.success(
        this.translationService.getValue('INVENTORY_SAVED_SUCCESSFULLY')
      );
      this.dialogRef.close(true);
    });
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Warehouse } from '@core/domain-classes/warehouse';
import { TranslationService } from '@core/services/translation.service';
import { WarehouseService } from '@core/services/warehouse.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-manage-warehouse',
  templateUrl: './manage-warehouse.component.html',
  styleUrls: ['./manage-warehouse.component.scss'],
})
export class ManageWarehouseComponent extends BaseComponent implements OnInit {
  isLoading = false;
  isEdit: boolean = false;
  warehouseForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManageWarehouseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Warehouse,
    private warehouseService: WarehouseService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.warehouseForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.warehouseForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      address: [''],
      contactPerson: [''],
      mobileNumber: [''],
      email: ['', [Validators.email]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveWarehouse(): void {
    if (!this.warehouseForm.valid) {
      this.warehouseForm.markAllAsTouched();
      return;
    }
    const warehouse: Warehouse = this.warehouseForm.value;
    this.isLoading = true;
    if (this.data.id) {
      this.warehouseService.update(warehouse).subscribe(
        () => {
          this.isLoading = false;
          this.toastrService.success(
            this.translationService.getValue('WAREHOUSE_UPDATED_SUCCESSFULLY')
          );
          this.dialogRef.close();
        },
        () => (this.isLoading = false)
      );
    } else {
      this.warehouseService.add(warehouse).subscribe(
        () => {
          this.isLoading = false;
          this.toastrService.success(
            this.translationService.getValue('WAREHOUSE_ADDED_SUCCESSFULLY')
          );
          this.dialogRef.close();
        },
        () => (this.isLoading = false)
      );
    }
  }
}

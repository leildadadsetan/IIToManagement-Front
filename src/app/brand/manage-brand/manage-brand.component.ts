import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Brand } from '@core/domain-classes/brand';
import { BrandService } from '@core/services/brand.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-manage-brand',
  templateUrl: './manage-brand.component.html',
  styleUrls: ['./manage-brand.component.scss']
})
export class ManageBrandComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  brandForm: UntypedFormGroup;
  imgSrc: any = null;
  isImageUpload: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ManageBrandComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Brand,
    private brandService: BrandService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.brandForm.patchValue(this.data);
      this.isEdit = true;
      if (this.data.imageUrl) {
        this.imgSrc = `${environment.apiUrl}${this.data.imageUrl}`;
      }
    }
    else {
      this.imgSrc = '';
    }
  }

  createForm() {
    this.brandForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  onFileSelect($event) {
    const fileSelected = $event.target.files[0];
    if (!fileSelected) {
      return;
    }
    const mimeType = fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    reader.onload = (_event) => {
      this.imgSrc = reader.result;
      this.isImageUpload = true;
      $event.target.value = '';
    }
  }

  onRemoveImage() {
    this.isImageUpload = true;
    this.imgSrc = '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveBrand(): void {
    if (!this.brandForm.valid) {
      this.brandForm.markAllAsTouched();
      return;
    }
    const brand: Brand = this.brandForm.value;
    brand.imageUrlData = this.imgSrc;
    brand.isImageChanged = this.isImageUpload;

    if (this.data.id) {
      this.brandService.update(brand).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('BRAND_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.brandService.add(brand).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('BRAND_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}

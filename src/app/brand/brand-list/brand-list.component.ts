import { Component, OnInit } from '@angular/core';
import { Brand } from '@core/domain-classes/brand';
import { BrandService } from '@core/services/brand.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})
export class BrandListComponent extends BaseComponent implements OnInit {
  brands$: Observable<Brand[]>;
  loading$: Observable<boolean>;
  constructor(
    private brandService: BrandService,
    public translationService: TranslationService,
    private toastrService: ToastrService) {
    super(translationService);
  }

  ngOnInit(): void {
    this.loading$ = this.brandService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getBrands();
          }
        })
      )
    this.brands$ = this.brandService.entities$
  }

  getBrands() {
    this.brandService.getAll();
  }

  deleteBrand(id: string): void {
    this.sub$.sink = this.brandService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('BRAND_DELETED_SUCCESSFULLY'));
    });
  }
}

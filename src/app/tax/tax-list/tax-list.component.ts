import { Component, OnInit } from '@angular/core';
import { Tax } from '@core/domain-classes/tax';
import { TaxService } from '@core/services/tax.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-tax-list',
  templateUrl: './tax-list.component.html',
  styleUrls: ['./tax-list.component.scss']
})
export class TaxListComponent extends BaseComponent implements OnInit {
  taxes$: Observable<Tax[]>;
  loading$: Observable<boolean>;

  constructor(
    private taxService: TaxService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
    super(translationService);
   
  }

  ngOnInit(): void {

    this.loading$ = this.taxService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getTaxes();
          }
        })
      )
    this.taxes$ = this.taxService.entities$
  }

  getTaxes(): void {
    this.taxService.getAll();
  }

  deleteTax(id: string): void {
    this.sub$.sink = this.taxService.delete(id).subscribe(() => {
      this.toastrService.success('Tax Deleted Successfully');
    });
  }
}



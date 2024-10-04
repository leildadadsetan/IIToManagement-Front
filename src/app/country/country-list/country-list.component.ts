import { Component, OnInit } from '@angular/core';
import { Country } from '@core/domain-classes/country';
import { CountryService } from '@core/services/country.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent extends BaseComponent implements OnInit {
  countries$: Observable<Country[]>;
  loading$: Observable<boolean>;
  constructor(
    private countryService: CountryService,
    private toastrService: ToastrService,
    public translationService: TranslationService) {
   super(translationService);
  }

  ngOnInit(): void {
    this.loading$ = this.countryService.loaded$
    .pipe(
      tap(loaded => {
        if (!loaded) {
          this.getCountries();
        }
      })
    )
  this.countries$ = this.countryService.entities$
  }

  getCountries(){
    this.countryService.getAll();
  }

  deleteCountry(id: string): void {
    this.sub$.sink = this.countryService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('COUNTRY_DELETED_SUCCESSFULLY'));
    });
  }
}

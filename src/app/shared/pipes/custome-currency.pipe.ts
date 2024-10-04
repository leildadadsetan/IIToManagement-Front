import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SecurityService } from '@core/security/security.service';

@Pipe({
    name: 'customCurrency',
    pure: true
})
export class CustomCurrencyPipe implements PipeTransform {
    constructor(private currencyPipe: CurrencyPipe, private securityService: SecurityService) {
    }
    transform(value: any, args?: any): any {
        value = value ?? 0;
        return this.currencyPipe.transform(value, this.securityService.currencyCode);
    }

}

import { Pipe, PipeTransform } from '@angular/core';
import { paymentMethods } from '@core/domain-classes/payment-method';
import { TranslationService } from '@core/services/translation.service';

@Pipe({
    name: 'paymentmethod'
})

export class PaymentMethodPipe implements PipeTransform {

    constructor(public translationService: TranslationService) {

    }
    transform(value: any, ...args: any[]): any {
        const paymentMethod = paymentMethods.find(c => c.id == value);
        if (paymentMethod) {
            return this.translationService.getValue(paymentMethod.name);
        }
        return '';
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { paymentStatuses } from '@core/domain-classes/paymentaStatus';
import { TranslationService } from '@core/services/translation.service';

@Pipe({
    name: 'paymentStatus'
})

export class PaymentStatusPipe implements PipeTransform {

    constructor(public translationService: TranslationService) {

    }
    transform(value: any, ...args: any[]): any {
        const paymentaStatus = paymentStatuses.find(c => c.id == value);
        if (paymentaStatus) {
            return this.translationService.getValue(paymentaStatus.name.replace(" ", "_").toUpperCase());
        }
        return '';
    }
}

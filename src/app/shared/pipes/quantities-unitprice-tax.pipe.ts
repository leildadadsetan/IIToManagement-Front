import { Pipe, PipeTransform } from '@angular/core';
import { Tax } from '@core/domain-classes/tax';

@Pipe({
  name: 'quantitiesunitpriceTax'
})

export class QuantitiesUnitPriceTaxPipe implements PipeTransform {
  transform(value: number, ...args: any[]): any {
    if(args.length === 1){
      const totalAmount = value * args[0];
      return parseFloat(totalAmount.toFixed(2));
    } else if(args.length === 2) {
      const totalAmount = value * args[0];
       if(args[1]){
        return this.getSubTotalAfterDiscount(totalAmount, parseFloat(args[1]));
      } else {
          return 0;
      }
    }
    else if(args.length===4){
      let totalAmount = value * args[0];
      if(args[1]){
        totalAmount = parseFloat( this.getSubTotalAfterDiscountWithTotalAmount(totalAmount, parseFloat(args[1])));
      }
       const taxIds =  args[2];
       const taxs =  args[3];
       if(taxIds && taxIds.length>0){
        return this.getSubTotalAfterTaxPercentage(totalAmount,taxIds,taxs );
      } else {
          return 0;
      }
    }
    return 0;
  }

  getSubTotalAfterTax(totalAmount: number, taxIds: Array<string>, taxs: Tax[]){
    const selectedPercentages:Array<number>=[];
    const selectedTaxs: Array<number>=[];
    taxIds.forEach(tax => {
      selectedPercentages.push(taxs.find(c=>c.id===tax).percentage);
      });

    selectedPercentages.forEach(percentage=>{
      selectedTaxs.push( (totalAmount * percentage) / 100);
    });
    selectedTaxs.forEach(c=>{
      totalAmount = totalAmount + c;
    })

    return totalAmount.toFixed(2);

  }

  getSubTotalAfterTaxPercentage(totalAmount: number, taxIds: Array<string>, taxs: Tax[]){
    const selectedPercentages:Array<number>=[];
    const selectedTaxs: Array<number>=[];
    let taxAmount=0;
    taxIds.forEach(tax => {
      selectedPercentages.push(taxs.find(c=>c.id===tax).percentage);
      });

    selectedPercentages.forEach(percentage=>{
      selectedTaxs.push( (totalAmount * percentage) / 100);
    });
    selectedTaxs.forEach(c=>{
      taxAmount= taxAmount + c;
    })

    return taxAmount.toFixed(2);

  }
  getSubTotalAfterDiscountWithTotalAmount(totalAmount: number, discount: number){
    let totalDiscount= (totalAmount * discount) / 100;
   const total=   totalAmount - totalDiscount;
   return total.toFixed(2);
  }

  getSubTotalAfterDiscount(totalAmount: number, discount: number){
    let totalDiscount= (totalAmount * discount) / 100;
   return totalDiscount.toFixed(2);
  }
}

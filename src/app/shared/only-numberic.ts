import { AbstractControl, ValidatorFn } from '@angular/forms';

export function onlyNumericValidator(name: string): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    const controlValue = c.value;
    if (!controlValue) {
      return null;
    }
    const numbers = /^[0-9]+$/;
    if (!controlValue.match(numbers)) {
      return { 'only_numeric': true };
    }
    return null;
  };
}

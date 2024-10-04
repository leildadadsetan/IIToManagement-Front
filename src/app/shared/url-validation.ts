import { AbstractControl } from '@angular/forms';

export function ValidateUrl(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const regexp = new RegExp(
      '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
    );
    const ctrlValue = control.value;
    if (!regexp.test(ctrlValue) && control.dirty && ctrlValue !== '') {
      return { valid_url: true };
    }
    return null;
  }
  
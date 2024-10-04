import { AbstractControl, ValidatorFn } from "@angular/forms";

export function  dateCompare(): ValidatorFn {
  return (controls: AbstractControl) => {
    const fromDate = controls.get('fromDate').value;
    const toDate = controls.get('toDate').value;
    if (fromDate  && toDate) {
      if ((Date.parse(fromDate) > Date.parse(toDate))) {
        return {dateRange:true}
      }
      return null;
    }
     else {
      return null;
    }
  };
}

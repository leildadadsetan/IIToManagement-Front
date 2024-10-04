import { Pipe, PipeTransform } from '@angular/core';
enum UTCToLocalTimeFormat {
  FULL = 'full',
  SHORT = 'short',
  SHORT_DATE = "shortDate",
  SHORT_TIME = "shortTime"
}

@Pipe({
  name: 'utcToLocalTime'
})

export class UTCToLocalTime implements PipeTransform {
  transform(utcDate: Date, format: UTCToLocalTimeFormat | string): any {
    const browserLanuges = navigator.language;
    if (!utcDate) {
      return '';
    }
    if (format === UTCToLocalTimeFormat.SHORT) {
      const date = new Date(utcDate).toLocaleDateString(browserLanuges);
      const time = new Date(utcDate).toLocaleTimeString(browserLanuges);
      return `${date} ${time}`;
      //  return moment.utc(utcDate).format("MM/DD/YYYY hh:mm:ss");
    }
    else if (format === UTCToLocalTimeFormat.SHORT_DATE) {
      const date = new Date(utcDate).toLocaleDateString(browserLanuges);
      return `${date}`;
    }
    else if (format === UTCToLocalTimeFormat.SHORT_TIME) {
      const time = new Date(utcDate).toLocaleTimeString(browserLanuges);
      return `${time}`;
    } else {
      const date = new Date(utcDate).toLocaleDateString(browserLanuges);
      const time = new Date(utcDate).toLocaleTimeString(browserLanuges);
      return `${date} ${time}`;
    }

  }
}

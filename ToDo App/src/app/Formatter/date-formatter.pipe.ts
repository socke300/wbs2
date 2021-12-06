import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe implements PipeTransform {
  transform(value: Date, args?: any): string {
    return new Date(value).toLocaleDateString("de-DE", {day: "2-digit", month: "long", year: "numeric"});
  }
}

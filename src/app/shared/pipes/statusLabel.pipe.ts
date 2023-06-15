import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel'
})
export class StatusLabelPipe implements PipeTransform {

  transform(status: number, statusMapping: any): string {
    if (statusMapping.hasOwnProperty(status)) {
      return statusMapping[status];
    }
    return '';
  }

}

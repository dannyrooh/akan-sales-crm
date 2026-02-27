import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneFormat', standalone: true })
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');

    if (digits.length === 13 && digits.startsWith('55')) {
      // +55 (XX) XXXXX-XXXX
      return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
    }
    if (digits.length === 11) {
      // (XX) XXXXX-XXXX
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    return value;
  }
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fileSizeValidator(maxSizeMB: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;

    if (file) {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      return file.size <= maxSizeBytes ? null : { fileSizeExceeded: true };
    }

    return null;
  };
}

export function minWordsValidator(minWords: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const words = value.trim().split(/\s+/);
    return words.length >= minWords ? null : { minWords: true };
  };
}

export function redberryEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && !value.endsWith('@redberry.ge')) {
      return { invalidEmailDomain: true };
    }
    return null;
  };
}

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const valid = /^5\d{8}$/.test(value);
    return valid ? null : { invalidPhoneNumber: true };
  };
}

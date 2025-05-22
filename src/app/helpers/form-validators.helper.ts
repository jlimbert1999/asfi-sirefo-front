import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomFormValidators {
  static matchFields(field: string, confirmField: string): ValidatorFn | null {
    return (formGroup: AbstractControl) => {
      const control1 = formGroup.get(field);
      const control2 = formGroup.get(confirmField);

      if (!control1 || !control2) return null;

      const currentErrors = control2.errors;

      if (compare(control1.value, control2.value)) {
        control2.setErrors({ ...currentErrors, not_match: true });
        return { not_match: true };
      } else {
        control2?.setErrors(currentErrors);
      }
      return null;
    };
  }

  static minWordsValidator(minWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount >= minWords
        ? null
        : { minWords: { requiredWords: minWords } };
    };
  }
}

function compare(field: string, confirmField: string) {
  return field !== confirmField && confirmField !== '';
}

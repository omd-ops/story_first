import { OnboardingFormData } from '../types';

export function getMaskedPhone(formData: OnboardingFormData) {
  return formData.phoneNumber
    ? `${formData.countryCode} ${'X'.repeat(Math.max(0, formData.phoneNumber.length - 2))}${formData.phoneNumber.slice(-2)}`
    : '';
}

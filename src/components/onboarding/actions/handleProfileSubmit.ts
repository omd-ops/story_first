import { OnboardingFormData, SetStep } from '../types';

export function handleProfileSubmit(formData: OnboardingFormData, setCurrentStep: SetStep) {
  if (formData.fullName) {
    setCurrentStep('waitlist');
  }
}

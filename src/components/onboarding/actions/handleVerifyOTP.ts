import { OnboardingFormData, SetStep } from '../types';

export function handleVerifyOTP(formData: OnboardingFormData, setCurrentStep: SetStep) {
  if (formData.otp.length === 6) {
    setCurrentStep('profile');
  }
}

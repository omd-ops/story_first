import { OnboardingFormData, SetStep } from '../types';

export function handleSendCode(
  formData: OnboardingFormData,
  setCurrentStep: SetStep,
  setCanResend: React.Dispatch<React.SetStateAction<boolean>>,
  setResendTimer: React.Dispatch<React.SetStateAction<number>>
) {
  if (formData.phoneNumber.length >= 10) {
    setCurrentStep('verify');
    setCanResend(false);
    setResendTimer(30);
  }
}

import { OnboardingFormData, SetFormData } from '../types';

export function handleResendCode(
  formData: OnboardingFormData,
  setCanResend: React.Dispatch<React.SetStateAction<boolean>>,
  setResendTimer: React.Dispatch<React.SetStateAction<number>>,
  setFormData: SetFormData
) {
  setCanResend(false);
  setResendTimer(30);
  setFormData({ ...formData, otp: '' });
}

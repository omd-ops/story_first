import { OnboardingFormData, SetFormData, SetStep } from '../types';

export function handleJourneySelect(
  mode: 'friends' | 'solo',
  formData: OnboardingFormData,
  setFormData: SetFormData,
  setCurrentStep: SetStep
) {
  setFormData({ ...formData, journeyMode: mode });
  if (mode === 'friends') {
    setCurrentStep('invite');
  } else {
    setCurrentStep('solo-confirm');
  }
}

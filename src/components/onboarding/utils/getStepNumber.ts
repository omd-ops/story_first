import { OnboardingStep } from '../types';

export function getStepNumber(currentStep: OnboardingStep) {
  const stepMap: { [key in OnboardingStep]: number } = {
    phone: 1,
    verify: 1,
    profile: 2,
    waitlist: 3,
    goals: 4,
    journey: 5,
    invite: 5,
    'solo-confirm': 5,
    schedule: 6,
  };

  return stepMap[currentStep];
}

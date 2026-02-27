import { SetFormData } from '../types';

export function handleGoalToggle(goal: string, setFormData: SetFormData) {
  setFormData((prev) => ({
    ...prev,
    selectedGoals: prev.selectedGoals.includes(goal)
      ? prev.selectedGoals.filter((g) => g !== goal)
      : [...prev.selectedGoals, goal],
  }));
}

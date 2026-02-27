import { SetFormData } from '../types';

export function handleGoalDetailChange(goal: string, detail: string, setFormData: SetFormData) {
  setFormData((prev) => ({
    ...prev,
    goalDetails: { ...prev.goalDetails, [goal]: detail },
  }));
}

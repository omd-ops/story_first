import { SetFormData } from '../types';

export function handleDayToggle(day: string, setFormData: SetFormData) {
  setFormData((prev) => ({
    ...prev,
    scheduleDays: prev.scheduleDays.includes(day)
      ? prev.scheduleDays.filter((d) => d !== day)
      : [...prev.scheduleDays, day],
  }));
}

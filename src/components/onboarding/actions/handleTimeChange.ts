import { SetFormData, TimeField } from '../types';

export function handleTimeChange(type: TimeField, value: number | string, setFormData: SetFormData) {
  setFormData((prev) => ({
    ...prev,
    scheduleTime: {
      ...prev.scheduleTime,
      [type]: value,
    },
  }));
}

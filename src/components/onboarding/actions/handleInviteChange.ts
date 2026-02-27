import { SetFormData } from '../types';

export function handleInviteChange(index: number, value: string, setFormData: SetFormData) {
  setFormData((prev) => ({
    ...prev,
    invites: prev.invites.map((inv, i) => (i === index ? { ...inv, value } : inv)),
  }));
}

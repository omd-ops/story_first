import { SetFormData } from '../types';

export function handleAddInvite(setFormData: SetFormData) {
  setFormData((prev) => ({
    ...prev,
    invites: [...prev.invites, { type: 'phone', value: '' }],
  }));
}

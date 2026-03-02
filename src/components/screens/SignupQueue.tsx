import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { Check, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type QueuePerson = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  status: string;
  signupDate: string | null;
  scheduleDays: string[];
  scheduleTime: { hour: number; minute: number; period: string } | null;
  timezone: string | null;
  approvalStatus: 'pending' | 'approved' | 'rejected';
};

function formatDate(dateInput: string | null) {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatSchedule(person: QueuePerson) {
  if (!person.scheduleTime || person.scheduleDays.length === 0) {
    return 'Not set';
  }

  return `${person.scheduleDays.join(', ')} • ${String(person.scheduleTime.hour)}:${String(
    person.scheduleTime.minute,
  ).padStart(2, '0')} ${person.scheduleTime.period}${person.timezone ? ` (${person.timezone})` : ''}`;
}

export function SignupQueue() {
  const [waitlist, setWaitlist] = useState<QueuePerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject'>('accept');
  const [selectedPerson, setSelectedPerson] = useState<QueuePerson | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pendingCount = useMemo(() => waitlist.length, [waitlist]);

  const loadQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/signup-queue', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.message ?? 'Failed to load signup queue');
      }
      setWaitlist(Array.isArray(json.items) ? json.items : []);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : 'Failed to load signup queue';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const openModal = (person: QueuePerson, action: 'accept' | 'reject') => {
    setSelectedPerson(person);
    setModalAction(action);
    setShowModal(true);
    setMessage('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPerson(null);
    setMessage('');
    setSubmitting(false);
  };

  const confirmAction = async () => {
    if (!selectedPerson) return;

    setSubmitting(true);
    setError(null);

    try {
      const endpoint =
        modalAction === 'accept'
          ? '/api/admin/signup-queue/approve'
          : '/api/admin/signup-queue/reject';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedPerson.id, message }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json?.message ?? 'Failed to update user status');
      }

      setWaitlist((prev) => prev.filter((person) => person.id !== selectedPerson.id));
      closeModal();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : 'Failed to update user status';
      setError(messageText);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Signup Queue"
        subtitle="Review pending users. Approve to activate and send SMS."
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-[var(--sf-border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--sf-border)] text-sm text-[var(--sf-text-secondary)]">
          Pending users: <span className="text-[var(--sf-text-primary)] font-semibold">{pendingCount}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--sf-border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]" style={{ fontFamily: 'var(--font-bebas)' }}>
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]" style={{ fontFamily: 'var(--font-bebas)' }}>
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]" style={{ fontFamily: 'var(--font-bebas)' }}>
                  Signup Date
                </th>
                <th className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]" style={{ fontFamily: 'var(--font-bebas)' }}>
                  Reminder Schedule
                </th>
                <th className="px-6 py-3 text-right text-xs tracking-wider text-[var(--sf-text-secondary)]" style={{ fontFamily: 'var(--font-bebas)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sf-border)]">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-sm text-[var(--sf-text-secondary)]">
                    Loading signup queue...
                  </td>
                </tr>
              )}

              {!loading && waitlist.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-sm text-[var(--sf-text-secondary)]">
                    No pending users.
                  </td>
                </tr>
              )}

              {!loading &&
                waitlist.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-[var(--sf-text-primary)] font-medium">{person.name || 'Unknown User'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--sf-text-secondary)]">
                      <p>{person.email || '-'}</p>
                      <p>{person.phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--sf-text-secondary)]">
                      {formatDate(person.signupDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--sf-text-secondary)] max-w-md">
                      {formatSchedule(person)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90"
                          onClick={() => openModal(person, 'accept')}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => openModal(person, 'reject')}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-[var(--sf-border)]">
              <h2 className="text-2xl tracking-wide" style={{ fontFamily: 'var(--font-bebas)' }}>
                {modalAction === 'accept' ? 'APPROVE USER' : 'REJECT USER'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-[var(--sf-text-primary)]">{selectedPerson.name || 'Unknown User'}</p>
                  <p className="text-sm text-[var(--sf-text-secondary)]">{selectedPerson.phone}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                  Admin message (optional)
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder={
                    modalAction === 'accept'
                      ? 'Optional note to include in the approval SMS...'
                      : 'Optional reason for rejection...'
                  }
                />
              </div>
            </div>

            <div className="p-6 border-t border-[var(--sf-border)] flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal} disabled={submitting}>
                Cancel
              </Button>
              <Button
                className={
                  modalAction === 'accept'
                    ? 'bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90'
                    : 'bg-red-600 hover:bg-red-700'
                }
                onClick={confirmAction}
                disabled={submitting}
              >
                {modalAction === 'accept' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {submitting ? 'Approving...' : 'Approve & Send SMS'}
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    {submitting ? 'Rejecting...' : 'Reject User'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

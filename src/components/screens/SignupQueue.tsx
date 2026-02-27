import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { ArrowUp, ArrowDown, Send, StickyNote, Check, X } from 'lucide-react';
import { useState } from 'react';

interface WaitlistPerson {
  id: number;
  name: string;
  email: string;
  signupDate: string;
  priority: number;
  notes: string;
}

export function SignupQueue() {
  const [waitlist, setWaitlist] = useState<WaitlistPerson[]>([
    { id: 1, name: 'Jennifer Lopez', email: 'jennifer.l@email.com', signupDate: 'Feb 1, 2026', priority: 1, notes: 'Referred by Sarah J.' },
    { id: 2, name: 'Marcus Smith', email: 'marcus.s@email.com', signupDate: 'Feb 2, 2026', priority: 2, notes: '' },
    { id: 3, name: 'Priya Patel', email: 'priya.p@email.com', signupDate: 'Feb 3, 2026', priority: 3, notes: 'Premium interest' },
    { id: 4, name: 'James Brown', email: 'james.b@email.com', signupDate: 'Feb 4, 2026', priority: 4, notes: '' },
    { id: 5, name: 'Sofia Garcia', email: 'sofia.g@email.com', signupDate: 'Feb 5, 2026', priority: 5, notes: '' },
  ]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject'>('accept');
  const [selectedPerson, setSelectedPerson] = useState<WaitlistPerson | null>(null);
  const [message, setMessage] = useState('');

  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteValue, setNoteValue] = useState('');

  const openModal = (person: WaitlistPerson, action: 'accept' | 'reject') => {
    setSelectedPerson(person);
    setModalAction(action);
    setShowModal(true);
    setMessage('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPerson(null);
    setMessage('');
  };

  const confirmAction = () => {
    if (!selectedPerson) return;

    // In a real app, this would make an API call with the message
    console.log(`${modalAction === 'accept' ? 'Accepting' : 'Rejecting'} ${selectedPerson.email} with message: ${message}`);
    
    setWaitlist(prev => prev.filter(person => person.id !== selectedPerson.id));
    closeModal();
  };

  const handleAccept = (person: WaitlistPerson) => {
    openModal(person, 'accept');
  };

  const handleReject = (person: WaitlistPerson) => {
    openModal(person, 'reject');
  };

  const handleMoveUp = (id: number, currentPriority: number) => {
    if (currentPriority === 1) return;
    
    setWaitlist(prev => prev.map(person => {
      if (person.id === id) {
        return { ...person, priority: currentPriority - 1 };
      }
      if (person.priority === currentPriority - 1) {
        return { ...person, priority: currentPriority };
      }
      return person;
    }).sort((a, b) => a.priority - b.priority));
  };

  const handleMoveDown = (id: number, currentPriority: number) => {
    if (currentPriority === waitlist.length) return;
    
    setWaitlist(prev => prev.map(person => {
      if (person.id === id) {
        return { ...person, priority: currentPriority + 1 };
      }
      if (person.priority === currentPriority + 1) {
        return { ...person, priority: currentPriority };
      }
      return person;
    }).sort((a, b) => a.priority - b.priority));
  };

  const handleNoteEdit = (id: number) => {
    const person = waitlist.find(p => p.id === id);
    if (person) {
      setEditingNoteId(id);
      setNoteValue(person.notes);
    }
  };

  const handleNoteSave = (id: number) => {
    if (editingNoteId === null) return;
    
    setWaitlist(prev => prev.map(person => {
      if (person.id === id) {
        return { ...person, notes: noteValue };
      }
      return person;
    }));
    setEditingNoteId(null);
    setNoteValue('');
  };

  const handleNoteCancel = () => {
    setEditingNoteId(null);
    setNoteValue('');
  };

  return (
    <div>
      <PageHeader 
        title="Signup Queue"
        subtitle="Manage waitlist priority and send activation links"
        actions={
          <Button className="bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90">
            <Send className="w-4 h-4 mr-2" />
            Bulk Send (Top 10)
          </Button>
        }
      />

      <div className="bg-white rounded-lg border border-[var(--sf-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--sf-border)]">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Priority
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Name
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Email
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Signup Date
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Notes
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sf-border)]">
              {waitlist.map(person => (
                <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-2xl text-[var(--sf-text-primary)]"
                        style={{ fontFamily: 'var(--font-bebas)' }}
                      >
                        {person.priority}
                      </span>
                      <div className="flex flex-col gap-1">
                        <button 
                          className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                          disabled={person.priority === 1}
                          onClick={() => handleMoveUp(person.id, person.priority)}
                        >
                          <ArrowUp className="w-3 h-3 text-[var(--sf-text-secondary)]" />
                        </button>
                        <button 
                          className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                          disabled={person.priority === waitlist.length}
                          onClick={() => handleMoveDown(person.id, person.priority)}
                        >
                          <ArrowDown className="w-3 h-3 text-[var(--sf-text-secondary)]" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-[var(--sf-text-primary)] font-medium">{person.name}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--sf-text-secondary)]">
                    {person.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--sf-text-secondary)]">
                    {person.signupDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {editingNoteId === person.id ? (
                        <>
                          <textarea
                            className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] resize-none"
                            value={noteValue}
                            onChange={(e) => setNoteValue(e.target.value)}
                            rows={1}
                            placeholder="Add a note..."
                          />
                          <Button
                            size="sm"
                            className="bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90"
                            onClick={() => handleNoteSave(person.id)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={handleNoteCancel}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </>
                      ) : person.notes ? (
                        <>
                          <StickyNote className="w-4 h-4 text-[var(--sf-orange)]" />
                          <span className="text-sm text-[var(--sf-text-primary)]">{person.notes}</span>
                        </>
                      ) : (
                        <button 
                          className="flex items-center gap-1.5 text-sm text-[var(--sf-text-muted)] hover:text-[var(--sf-text-primary)] transition-colors" 
                          onClick={() => handleNoteEdit(person.id)}
                        >
                          <StickyNote className="w-4 h-4" />
                          Add note
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        size="sm"
                        className="bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90"
                        onClick={() => handleAccept(person)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(person)}
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

      {/* Modal */}
      {showModal && selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-[var(--sf-border)]">
              <h2 
                className="text-2xl tracking-wide"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {modalAction === 'accept' ? 'ACCEPT USER' : 'REJECT USER'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-[var(--sf-text-primary)]">{selectedPerson.name}</p>
                  <p className="text-sm text-[var(--sf-text-secondary)]">{selectedPerson.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                  Message to user (optional)
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder={modalAction === 'accept' 
                    ? "Add a welcome message (will be sent via email)..." 
                    : "Add a reason for rejection (optional)..."}
                />
                <p className="text-xs text-[var(--sf-text-muted)] mt-2">
                  {modalAction === 'accept' 
                    ? "This message will be included in the activation email" 
                    : "This message will be included in the notification email"}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-[var(--sf-border)] flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                className={modalAction === 'accept' 
                  ? 'bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90' 
                  : 'bg-red-600 hover:bg-red-700'}
                onClick={confirmAction}
              >
                {modalAction === 'accept' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Accept & Send Link
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject User
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
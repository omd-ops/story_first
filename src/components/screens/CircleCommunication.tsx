import { useState } from 'react';
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { Send, Eye, Mail, MessageSquare } from 'lucide-react';

export function CircleCommunication() {
  const [selectedCircle, setSelectedCircle] = useState('writers-guild');
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');
  const [message, setMessage] = useState('');

  const circles = [
    { id: 'writers-guild', name: 'Writers Guild', members: 24 },
    { id: 'beginners', name: 'Beginners Journey', members: 45 },
    { id: 'advanced', name: 'Advanced Storytellers', members: 12 },
    { id: 'entrepreneurs', name: 'Creative Entrepreneurs', members: 31 },
  ];

  const selectedCircleData = circles.find(c => c.id === selectedCircle);

  return (
    <div>
      <PageHeader 
        title="Bulk Communication"
        subtitle="Send messages to circle members"
      />

      {/* Top row: Select Circle and Message Type in single container */}
      <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Select Circle */}
          <div>
            <h3 
              className="text-lg tracking-wide mb-4"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              Select Circle
            </h3>
            <div>
              <select 
                value={selectedCircle}
                onChange={(e) => setSelectedCircle(e.target.value)}
                className="w-full h-[52px] px-4 border border-[var(--sf-border)] rounded-lg"
              >
                {circles.map(circle => (
                  <option key={circle.id} value={circle.id}>
                    {circle.name} ({circle.members} members)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message Type */}
          <div>
            <h3 
              className="text-lg tracking-wide mb-4"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              Message Type
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 h-[52px] px-4 border-2 rounded-lg cursor-pointer transition-all ${
                messageType === 'email' 
                  ? 'border-[var(--sf-orange)] bg-[var(--sf-orange)]/5' 
                  : 'border-[var(--sf-border)] hover:border-[var(--sf-orange)]/30 hover:bg-gray-50'
              }`}>
                <input 
                  type="radio" 
                  name="type" 
                  value="email"
                  checked={messageType === 'email'}
                  onChange={(e) => setMessageType(e.target.value as 'email')}
                  className="w-5 h-5 text-[var(--sf-orange)] focus:ring-[var(--sf-orange)] focus:ring-2"
                />
                <Mail className={`w-5 h-5 ${
                  messageType === 'email' ? 'text-[var(--sf-orange)]' : 'text-[var(--sf-text-secondary)]'
                }`} />
                <p className={`font-medium ${
                  messageType === 'email' ? 'text-[var(--sf-orange)]' : 'text-[var(--sf-text-primary)]'
                }`}>Email</p>
              </label>
              <label className={`flex items-center gap-3 h-[52px] px-4 border-2 rounded-lg cursor-pointer transition-all ${
                messageType === 'sms' 
                  ? 'border-[var(--sf-orange)] bg-[var(--sf-orange)]/5' 
                  : 'border-[var(--sf-border)] hover:border-[var(--sf-orange)]/30 hover:bg-gray-50'
              }`}>
                <input 
                  type="radio" 
                  name="type" 
                  value="sms"
                  checked={messageType === 'sms'}
                  onChange={(e) => setMessageType(e.target.value as 'sms')}
                  className="w-5 h-5 text-[var(--sf-orange)] focus:ring-[var(--sf-orange)] focus:ring-2"
                />
                <MessageSquare className={`w-5 h-5 ${
                  messageType === 'sms' ? 'text-[var(--sf-orange)]' : 'text-[var(--sf-text-secondary)]'
                }`} />
                <p className={`font-medium ${
                  messageType === 'sms' ? 'text-[var(--sf-orange)]' : 'text-[var(--sf-text-primary)]'
                }`}>SMS</p>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Compose Message and Recent Messages side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Message */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <h3 
            className="text-base tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Compose Message
          </h3>

          <div className="space-y-4">
            {messageType === 'email' && (
              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                  Subject Line
                </label>
                <input 
                  type="text"
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                Message {messageType === 'sms' && '(160 characters max)'}
              </label>
              <textarea 
                rows={messageType === 'email' ? 12 : 4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  messageType === 'email' 
                    ? 'Write your email message...' 
                    : 'Write your SMS message...'
                }
                className="w-full px-4 py-3 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                maxLength={messageType === 'sms' ? 160 : undefined}
              />
              {messageType === 'sms' && (
                <p className="text-xs text-[var(--sf-text-muted)] mt-1">
                  {message.length}/160 characters
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--sf-border)] flex items-center justify-between">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90">
              <Send className="w-4 h-4 mr-2" />
              Send to {selectedCircleData?.members} Members
            </Button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <h3 
            className="text-lg tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Recent Messages
          </h3>
          <div className="space-y-3">
            {[
              { date: 'Feb 6, 2026', subject: 'Welcome to Writers Guild', type: 'email', sent: 24 },
              { date: 'Feb 4, 2026', subject: 'Weekly inspiration boost', type: 'sms', sent: 45 },
              { date: 'Feb 1, 2026', subject: 'New content available', type: 'email', sent: 31 },
            ].map((msg, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--sf-border)] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[var(--sf-text-primary)]">{msg.subject}</p>
                  <p className="text-xs text-[var(--sf-text-muted)]">
                    {msg.type.toUpperCase()} • {msg.date} • Sent to {msg.sent} members
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
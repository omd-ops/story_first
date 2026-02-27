import { useState } from 'react';
import { PageHeader } from '../shared/PageHeader';
import { Mail, Phone, User, Clock } from 'lucide-react';

interface CircleRequest {
  id: number;
  userName: string;
  email: string;
  phone: string;
  requestDate: string;
}

export function CircleRequests() {
  const [requests] = useState<CircleRequest[]>([
    {
      id: 1,
      userName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      requestDate: 'Feb 15, 2026'
    },
    {
      id: 2,
      userName: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      requestDate: 'Feb 15, 2026'
    },
    {
      id: 3,
      userName: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1 (555) 345-6789',
      requestDate: 'Feb 14, 2026'
    },
    {
      id: 4,
      userName: 'David Park',
      email: 'david.park@email.com',
      phone: '+1 (555) 456-7890',
      requestDate: 'Feb 14, 2026'
    },
    {
      id: 5,
      userName: 'Jessica Martinez',
      email: 'jessica.m@email.com',
      phone: '+1 (555) 567-8901',
      requestDate: 'Feb 13, 2026'
    },
    {
      id: 6,
      userName: 'Alex Thompson',
      email: 'alex.t@email.com',
      phone: '+1 (555) 678-9012',
      requestDate: 'Feb 12, 2026'
    },
    {
      id: 7,
      userName: 'Rachel Kim',
      email: 'rachel.kim@email.com',
      phone: '+1 (555) 789-0123',
      requestDate: 'Feb 11, 2026'
    },
    {
      id: 8,
      userName: 'James Wilson',
      email: 'james.w@email.com',
      phone: '+1 (555) 890-1234',
      requestDate: 'Feb 10, 2026'
    }
  ]);

  return (
    <div>
      <PageHeader 
        title="Circle requests"
        subtitle="View user requests to join circles"
      />

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white border border-[var(--sf-border)] p-12 text-center">
            <p className="text-[var(--sf-text-muted)]">
              No requests found
            </p>
          </div>
        ) : (
          requests.map(request => (
            <div 
              key={request.id} 
              className="bg-white border border-[var(--sf-border)] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 
                    className="text-xl tracking-wide"
                    style={{ fontFamily: 'var(--font-bebas)' }}
                  >
                    {request.userName}
                  </h3>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--sf-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--sf-text-muted)]">Email</p>
                    <p className="text-sm text-[var(--sf-text-primary)]">{request.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--sf-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--sf-text-muted)]">Phone</p>
                    <p className="text-sm text-[var(--sf-text-primary)]">{request.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--sf-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--sf-text-muted)]">Request Date</p>
                    <p className="text-sm text-[var(--sf-text-primary)]">{request.requestDate}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
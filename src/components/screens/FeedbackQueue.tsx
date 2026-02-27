import { PageHeader } from '../shared/PageHeader';
import { StatusBadge } from '../shared/StatusBadge';
import { Button } from '../ui/button';
import { Eye, CheckCircle, Filter } from 'lucide-react';
import { useState } from 'react';

interface FeedbackQueueProps {
  onViewFeedback: () => void;
}

export function FeedbackQueue({ onViewFeedback }: FeedbackQueueProps) {
  const [sortBy, setSortBy] = useState<'date' | 'day' | 'user'>('date');
  const [filterType, setFilterType] = useState<'all' | 'qa' | 'challenge'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const feedbackItems = [
    { id: 1, user: 'Sarah Johnson', day: 35, submittedDate: '2 hours ago', status: 'pending', type: 'challenge', preview: 'Today I explored how vulnerability in storytelling creates conn...' },
    { id: 2, user: 'Mike Chen', day: 28, submittedDate: '4 hours ago', status: 'pending', type: 'challenge', preview: 'Reflecting on character development, I realized that my chara...' },
    { id: 3, user: 'Emma Davis', day: 15, submittedDate: '5 hours ago', status: 'pending', type: 'challenge', preview: 'The challenge today pushed me to think differently about narr...' },
    { id: 4, user: 'Alex Thompson', day: 48, submittedDate: '6 hours ago', status: 'pending', type: 'challenge', preview: 'Working through the emotional arc exercise helped me underst...' },
    { id: 5, user: 'Lisa Park', day: 22, submittedDate: '8 hours ago', status: 'pending', type: 'qa', preview: 'Today\'s lesson on dialogue was transformative. I never realize...' },
  ];

  return (
    <div>
      <PageHeader 
        title="Grading Queue"
        subtitle="Review and approve AI-generated feedback"
        actions={
          <>
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90">
              <CheckCircle className="w-4 h-4 mr-2" />
              Bulk Approve (All)
            </Button>
          </>
        }
      />

      <div className="mb-4 flex items-center gap-4">
        <div className="bg-white rounded-lg border border-[var(--sf-border)] px-4 py-2">
          <span className="text-sm text-[var(--sf-text-muted)]\">Pending: </span>
          <span 
            className="text-xl text-[var(--sf-orange)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {feedbackItems.length}
          </span>
        </div>

        {feedbackItems.length > 50 && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-sm text-red-600">⚠️ High volume alert: {feedbackItems.length} pending reviews</span>
          </div>
        )}
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
              >
                <option value="date">Submission Date</option>
                <option value="day">Lesson Day</option>
                <option value="user">User Name</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Submission Type</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
              >
                <option value="all">All Types</option>
                <option value="qa">Q&A Only</option>
                <option value="challenge">Challenge Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[var(--sf-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--sf-border)]">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  User
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Day
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Response Preview
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Submitted
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Status
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
              {feedbackItems.map(item => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onDoubleClick={onViewFeedback}
                  title="Double-click to review"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-[var(--sf-text-primary)] font-medium">{item.user}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="text-lg text-[var(--sf-text-primary)]"
                      style={{ fontFamily: 'var(--font-bebas)' }}
                    >
                      DAY {item.day}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="text-sm text-[var(--sf-text-secondary)] truncate">{item.preview}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--sf-text-secondary)]">
                    {item.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status as any} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewFeedback();
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { Eye, Filter, Bug, Lightbulb, X } from 'lucide-react';
import { useState } from 'react';

export function UserFeedback() {
  const [sortBy, setSortBy] = useState<'date' | 'screen' | 'type'>('date');
  const [filterType, setFilterType] = useState<'all' | 'bug' | 'idea'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState<{ user: string; screenName: string; type: string; description: string } | null>(null);

  const feedbackItems = [
    { 
      id: 1, 
      user: 'Sarah Johnson', 
      screenName: 'Feed', 
      type: 'bug', 
      description: 'The metrics card showing total XP is not updating in real-time. When users complete lessons, they have to refresh the page to see their updated XP score. This creates confusion and makes the experience feel less responsive. The issue appears to be related to the WebSocket connection not properly updating the dashboard metrics in real-time.', 
      submittedDate: 'Feb 11, 2026', 
      status: 'pending' 
    },
    { 
      id: 2, 
      user: 'Mike Chen', 
      screenName: 'Learn', 
      type: 'idea', 
      description: 'It would be great to have a bulk edit feature for multiple lessons. Currently, when I need to update settings or metadata across several lessons, I have to edit them one by one which is very time-consuming. A feature that allows selecting multiple lessons and applying changes to all of them at once would significantly improve the workflow.', 
      submittedDate: 'Feb 10, 2026', 
      status: 'pending' 
    },
    { 
      id: 3, 
      user: 'Emma Davis', 
      screenName: 'Challenge', 
      type: 'bug', 
      description: 'When trying to delete a circle, the confirmation modal doesn\'t appear. Instead, the circle gets deleted immediately without any warning, which is dangerous for accidental clicks. This has already caused me to accidentally delete a circle with active members. The delete action should always show a confirmation dialog first.', 
      submittedDate: 'Feb 10, 2026', 
      status: 'resolved' 
    },
    { 
      id: 4, 
      user: 'Alex Thompson', 
      screenName: 'QA', 
      type: 'idea', 
      description: 'Add ability to export user data to CSV format for reporting. It would be incredibly helpful for generating reports for stakeholders and analyzing user behavior patterns. The export should include basic user info, engagement metrics, lesson completion rates, and activity timestamps. This would save hours of manual data collection.', 
      submittedDate: 'Feb 9, 2026', 
      status: 'pending' 
    },
    { 
      id: 5, 
      user: 'Lisa Park', 
      screenName: 'Feed', 
      type: 'bug', 
      description: 'The celebration emoji picker is not showing all available emojis. Only about 20 emojis appear in the picker, but there should be many more options available. This limits our ability to create diverse and engaging celebration messages for users. The emoji picker library might need to be updated or the configuration needs adjustment.', 
      submittedDate: 'Feb 9, 2026', 
      status: 'pending' 
    },
    { 
      id: 6, 
      user: 'John Smith', 
      screenName: 'Learn', 
      type: 'idea', 
      description: 'Would love to see analytics on signup conversion rates by source. Understanding where our most successful signups come from would help optimize our marketing efforts and resource allocation. This should include tracking data like referral source, time to complete signup, drop-off points, and conversion rates by channel.', 
      submittedDate: 'Feb 8, 2026', 
      status: 'resolved' 
    },
  ];

  const filteredItems = feedbackItems.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    return true;
  });

  // Sort the filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        // Sort by date (newest first)
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      case 'screen':
        // Sort alphabetically by screen name
        return a.screenName.localeCompare(b.screenName);
      case 'type':
        // Sort by type (bugs first, then ideas)
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const handleDescriptionDoubleClick = (item: typeof feedbackItems[0]) => {
    setSelectedDescription({
      user: item.user,
      screenName: item.screenName,
      type: item.type,
      description: item.description
    });
  };

  return (
    <div>
      <PageHeader 
        title="User Feedback"
        subtitle="Track bugs and feature ideas from users"
      />

      <div className="mb-4 flex items-center gap-4">
        <div className="bg-white rounded-lg border border-[var(--sf-border)] px-4 py-2">
          <span className="text-sm text-[var(--sf-text-muted)]">Bugs: </span>
          <span 
            className="text-xl text-red-600"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {feedbackItems.filter(item => item.type === 'bug').length}
          </span>
        </div>

        <div className="bg-white rounded-lg border border-[var(--sf-border)] px-4 py-2">
          <span className="text-sm text-[var(--sf-text-muted)]">Ideas: </span>
          <span 
            className="text-xl text-[var(--sf-blue)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {feedbackItems.filter(item => item.type === 'idea').length}
          </span>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full h-[52px] px-4 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
              >
                <option value="date">Submission Date</option>
                <option value="screen">Screen Name</option>
                <option value="type">Feedback Type</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Feedback Type</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full h-[52px] px-4 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
              >
                <option value="all">All Types</option>
                <option value="bug">Bugs Only</option>
                <option value="idea">Ideas Only</option>
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
                  Type
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Screen Name
                </th>
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
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sf-border)]">
              {sortedItems.map(item => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onDoubleClick={() => handleDescriptionDoubleClick(item)}
                  title="Double-click to view full description"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.type === 'bug' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                          <Bug className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-red-600">Bug</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Lightbulb className="w-4 h-4 text-[var(--sf-blue)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--sf-blue)]">Idea</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-[var(--sf-text-primary)] font-medium">{item.screenName}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-[var(--sf-text-secondary)]">{item.user}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[var(--sf-text-secondary)] leading-relaxed">{item.description}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDescription && (
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-[var(--sf-text-primary)]">Feedback Details</h3>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => setSelectedDescription(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">User</label>
              <p className="text-sm text-[var(--sf-text-primary)] font-medium">{selectedDescription.user}</p>
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Screen Name</label>
              <p className="text-sm text-[var(--sf-text-primary)] font-medium">{selectedDescription.screenName}</p>
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Type</label>
              <p className="text-sm text-[var(--sf-text-primary)] font-medium">{selectedDescription.type}</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Description</label>
            <p className="text-sm text-[var(--sf-text-secondary)]">{selectedDescription.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
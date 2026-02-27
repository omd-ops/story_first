import { PageHeader } from '../shared/PageHeader';
import { StatusBadge } from '../shared/StatusBadge';
import { Button } from '../ui/button';
import { Edit, Eye, Upload, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface ContentDashboardProps {
  onEditDay: (day: number) => void;
}

export function ContentDashboard({ onEditDay }: ContentDashboardProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previewDay, setPreviewDay] = useState<number | null>(null);

  // Day 0 - Orientation Video
  const day0 = {
    day: 0,
    title: 'Day 0: Orientation Video',
    status: 'published',
    lastEdited: '2 days ago',
  };

  const days = Array.from({ length: 70 }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1}: ${i % 3 === 0 ? 'Finding Your Voice' : i % 3 === 1 ? 'Story Structure' : 'Character Development'}`,
    status: i < 30 ? 'published' : i < 50 ? 'ready' : 'draft',
    lastEdited: '2 days ago',
  }));

  // Combine Day 0 with regular days
  const allDays = [day0, ...days];

  // Filter days based on status
  const filteredDays = statusFilter === 'all' 
    ? allDays 
    : allDays.filter(day => day.status === statusFilter);

  const handlePreview = (day: number) => {
    setPreviewDay(day);
  };

  const handleDoubleClick = (day: number) => {
    onEditDay(day);
  };

  return (
    <div>
      <PageHeader 
        title="Content Dashboard"
        subtitle="Manage Day 0 orientation + all 70 days of content"
        actions={
          <Button variant="outline" onClick={() => setFilterOpen(!filterOpen)}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        }
      />

      {filterOpen && (
        <div className="bg-white rounded-lg border border-[var(--sf-border)] overflow-hidden mb-4 p-4">
          <div className="flex items-center justify-between mb-3">
            <p 
              className="text-sm tracking-wider text-[var(--sf-text-secondary)]"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              Status Filter
            </p>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setFilterOpen(false)}>
              <X className="w-4 h-4 text-[var(--sf-text-secondary)]" />
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === 'all' 
                  ? 'bg-[var(--sf-yellow)] text-[var(--sf-text-primary)]' 
                  : 'bg-gray-100 text-[var(--sf-text-secondary)] hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('all')}
            >
              All ({allDays.length})
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === 'published' 
                  ? 'bg-[var(--sf-yellow)] text-[var(--sf-text-primary)]' 
                  : 'bg-gray-100 text-[var(--sf-text-secondary)] hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('published')}
            >
              Published ({allDays.filter(d => d.status === 'published').length})
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === 'ready' 
                  ? 'bg-[var(--sf-yellow)] text-[var(--sf-text-primary)]' 
                  : 'bg-gray-100 text-[var(--sf-text-secondary)] hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('ready')}
            >
              Ready ({allDays.filter(d => d.status === 'ready').length})
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === 'draft' 
                  ? 'bg-[var(--sf-yellow)] text-[var(--sf-text-primary)]' 
                  : 'bg-gray-100 text-[var(--sf-text-secondary)] hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('draft')}
            >
              Draft ({allDays.filter(d => d.status === 'draft').length})
            </button>
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
                  Day
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Lesson Title
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Last Edited
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
              {filteredDays.map(day => (
                <tr key={day.day} className="hover:bg-gray-50 transition-colors" onDoubleClick={() => handleDoubleClick(day.day)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="text-xl text-[var(--sf-text-primary)]"
                      style={{ fontFamily: 'var(--font-bebas)' }}
                    >
                      {day.day}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[var(--sf-text-primary)] font-medium">{day.title}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={day.status as any} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--sf-text-secondary)]">
                    {day.lastEdited}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => onEditDay(day.day)}>
                        <Edit className="w-4 h-4 text-[var(--sf-text-secondary)]" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => handlePreview(day.day)}>
                        <Eye className="w-4 h-4 text-[var(--sf-text-secondary)]" />
                      </button>
                      {day.status === 'ready' && (
                        <Button size="sm" className="bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90">
                          <Upload className="w-3 h-3 mr-1" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDay && (() => {
        const day = allDays.find(d => d.day === previewDay);
        if (!day) return null;
        
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
                <div>
                  <h2 
                    className="text-2xl tracking-wide"
                    style={{ fontFamily: 'var(--font-bebas)' }}
                  >
                    Lesson Preview - Day {day.day}
                  </h2>
                  <p className="text-sm text-[var(--sf-text-muted)] mt-1">
                    {day.title}
                  </p>
                </div>
                <button 
                  onClick={() => setPreviewDay(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status={day.status as any} />
                  <span className="text-sm text-[var(--sf-text-muted)]">
                    Last edited: {day.lastEdited}
                  </span>
                </div>

                <div className="border-t border-[var(--sf-border)] pt-4">
                  <h3 
                    className="text-lg tracking-wide mb-2"
                    style={{ fontFamily: 'var(--font-bebas)' }}
                  >
                    Lesson Content
                  </h3>
                  <p className="text-sm text-[var(--sf-text-secondary)] mb-4">
                    This is a preview of the lesson content. The actual lesson content would be displayed here with full formatting, images, and interactive elements.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-[var(--sf-text-secondary)]">
                      <strong>Lesson Objective:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-[var(--sf-text-primary)] mb-1">Section 1: Introduction</h4>
                      <p className="text-sm text-[var(--sf-text-secondary)]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[var(--sf-text-primary)] mb-1">Section 2: Key Concepts</h4>
                      <p className="text-sm text-[var(--sf-text-secondary)]">
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[var(--sf-text-primary)] mb-1">Section 3: Practice Exercise</h4>
                      <p className="text-sm text-[var(--sf-text-secondary)]">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[var(--sf-border)] flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setPreviewDay(null)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                  onClick={() => {
                    setPreviewDay(null);
                    onEditDay(day.day);
                  }}
                >
                  Edit Lesson
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
import { useState } from 'react';
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { Edit, History, FileText, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';

interface PromptVersion {
  id: number;
  version: string;
  content: string;
  createdDate: string;
  createdBy: string;
  isActive: boolean;
  changes?: string;
}

export function PromptManagement() {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [changeNotes, setChangeNotes] = useState('');

  const [versions, setVersions] = useState<PromptVersion[]>([
    {
      id: 1,
      version: 'v3.1',
      content: 'Evaluate the user\'s storytelling submission based on: narrative structure, emotional resonance, vivid details, authentic voice, and learning objectives. Provide specific, encouraging feedback with 2-3 concrete suggestions for improvement. Celebrate strengths before addressing areas for growth.',
      createdDate: 'Feb 12, 2026',
      createdBy: 'Admin',
      isActive: true,
      changes: 'Added "celebrate strengths first" guideline'
    },
    {
      id: 2,
      version: 'v3.0',
      content: 'Review the user\'s submission for narrative quality. Assess structure, emotional impact, detail usage, and voice authenticity. Provide constructive feedback highlighting both strengths and areas for improvement.',
      createdDate: 'Jan 30, 2026',
      createdBy: 'Coach Devon',
      isActive: false,
      changes: 'Major restructure of evaluation criteria'
    },
    {
      id: 3,
      version: 'v2.5',
      content: 'Evaluate storytelling submissions based on narrative structure, emotional impact, and authentic voice. Provide balanced feedback.',
      createdDate: 'Jan 15, 2026',
      createdBy: 'Admin',
      isActive: false,
      changes: 'Simplified evaluation framework'
    },
    {
      id: 4,
      version: 'v2.0',
      content: 'Review user submissions and provide feedback on storytelling quality, focusing on structure and voice.',
      createdDate: 'Dec 20, 2025',
      createdBy: 'StoryFirst Team',
      isActive: false,
      changes: 'Initial version 2 release'
    }
  ]);

  const activeVersion = versions.find(v => v.isActive);
  const inactiveVersions = versions.filter(v => !v.isActive);

  const setActiveVersion = (versionId: number) => {
    setVersions(versions.map(v => ({
      ...v,
      isActive: v.id === versionId
    })));
  };

  const handleOpenEditModal = () => {
    if (activeVersion) {
      setEditedContent(activeVersion.content);
      setChangeNotes('');
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (!activeVersion || !editedContent.trim()) {
      return;
    }

    // Get current version number and increment
    const currentVersionNum = parseFloat(activeVersion.version.replace('v', ''));
    const newVersionNum = (currentVersionNum + 0.1).toFixed(1);
    const newVersion = `v${newVersionNum}`;

    // Create new version
    const newVersionEntry: PromptVersion = {
      id: Math.max(...versions.map(v => v.id)) + 1,
      version: newVersion,
      content: editedContent,
      createdDate: 'Today',
      createdBy: 'Admin',
      isActive: true,
      changes: changeNotes || 'Updated prompt content'
    };

    // Set current active to inactive and add new version
    setVersions([
      newVersionEntry,
      ...versions.map(v => ({ ...v, isActive: false }))
    ]);

    setIsEditModalOpen(false);
    setEditedContent('');
    setChangeNotes('');
  };

  return (
    <div>
      <PageHeader 
        title="Grading prompt"
        subtitle="Manage AI prompt for grading user submissions"
        actions={
          <Button 
            className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
            onClick={handleOpenEditModal}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Prompt
          </Button>
        }
      />

      {/* Active Prompt */}
      <div className="bg-white border border-[var(--sf-border)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 
                className="text-xl tracking-wide"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                Active Prompt
              </h3>
              <span className="px-2 py-0.5 bg-[var(--sf-orange)] text-white text-xs">
                {activeVersion?.version}
              </span>
            </div>
            <p className="text-sm text-[var(--sf-text-muted)]">
              Updated {activeVersion?.createdDate} by {activeVersion?.createdBy}
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setShowVersionHistory(!showVersionHistory)}
          >
            <History className="w-4 h-4 mr-2" />
            {showVersionHistory ? 'Hide' : 'View'} Version History ({versions.length - 1})
          </Button>
        </div>

        {/* Active Prompt Content */}
        <div className="bg-gray-50 p-6 border border-[var(--sf-border)]">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[var(--sf-text-muted)]" />
            <span className="text-sm font-medium text-[var(--sf-text-secondary)]">Prompt Content</span>
          </div>
          <p className="text-[var(--sf-text-primary)] leading-relaxed">
            {activeVersion?.content}
          </p>
        </div>
      </div>

      {/* Version History */}
      {showVersionHistory && (
        <div className="bg-white border border-[var(--sf-border)] p-6">
          <h4 
            className="text-lg tracking-wide mb-4 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            <History className="w-5 h-5" />
            Previous Versions
          </h4>
          <div className="space-y-4">
            {inactiveVersions.map(version => (
              <div 
                key={version.id}
                className="border border-[var(--sf-border)] p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 
                        className="text-lg tracking-wide"
                        style={{ fontFamily: 'var(--font-bebas)' }}
                      >
                        {version.version}
                      </h5>
                    </div>
                    <div className="text-sm text-[var(--sf-text-muted)] mb-2">
                      {version.createdDate} • By {version.createdBy}
                    </div>
                    {version.changes && (
                      <div className="text-sm text-[var(--sf-text-secondary)] mb-3">
                        <strong>Changes:</strong> {version.changes}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveVersion(version.id)}
                  >
                    Set Active
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 border border-[var(--sf-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[var(--sf-text-muted)]" />
                    <span className="text-sm font-medium text-[var(--sf-text-secondary)]">Prompt Content</span>
                  </div>
                  <p className="text-sm text-[var(--sf-text-primary)] leading-relaxed">
                    {version.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle 
              className="text-2xl tracking-wide"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              Edit Grading Prompt
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-[var(--sf-text-muted)]" />
                <label className="text-sm font-medium text-[var(--sf-text-secondary)]">Prompt Content</label>
              </div>
              <textarea
                className="w-full p-4 border border-[var(--sf-border)] focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] text-sm leading-relaxed"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={10}
                placeholder="Enter the grading prompt content..."
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Edit className="w-5 h-5 text-[var(--sf-text-muted)]" />
                <label className="text-sm font-medium text-[var(--sf-text-secondary)]">Change Notes (Optional)</label>
              </div>
              <textarea
                className="w-full p-4 border border-[var(--sf-border)] focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] text-sm"
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                rows={3}
                placeholder="Describe what changed in this version..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
              onClick={handleSaveEdit}
              disabled={!editedContent.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { ArrowLeft, CheckCircle, XCircle, Edit3, Sparkles, Play, Mail, User, Target, Calendar, Trophy } from 'lucide-react';
import { useState } from 'react';

interface FeedbackDetailProps {
  onBack: () => void;
}

export function FeedbackDetail({ onBack }: FeedbackDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newFeedback, setNewFeedback] = useState('');

  // Mock data - in real app this would come from props/API
  const submission = {
    id: 1,
    type: 'challenge' as const,
    responseType: 'audio' as const, // Changed from 'text' to 'audio'
    prompt: 'Share a personal story that demonstrates vulnerability in storytelling. Reflect on how opening up emotionally affects your narrative.',
    response: `Today I explored how vulnerability in storytelling creates connection with the audience. I shared a personal story about my grandmother's immigration journey, and I noticed how opening up about my family's struggles made the narrative more authentic and relatable.

The exercise challenged me to be more honest in my writing, and I realized I've been holding back certain emotions out of fear of being too exposed. But Coach Devon's feedback about "courage in storytelling" really resonated with me.

I'm starting to understand that the stories that matter most are often the ones we're most afraid to tell.`,
    submittedDate: '2 hours ago',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      currentDay: 35,
      streak: 12,
      goal: 'Complete 90-day storytelling mastery',
    },
    aiFeedback: {
      original: `Sarah, your reflection shows tremendous growth in understanding the power of vulnerability in storytelling. Your insight about sharing your grandmother's immigration journey demonstrates authentic emotional engagement.

What stands out is your willingness to examine your own resistance to vulnerability - that self-awareness is crucial for developing as a storyteller. The connection you're making between fear and meaningful storytelling is exactly the kind of breakthrough that transforms writers.

For your next practice, consider: What specific moment in that immigration story felt most difficult to share? That's often where the most powerful truth lives.

Keep bringing this courage to your work. You're discovering your authentic voice.`,
      // For Q&A type
      correctness: {
        evaluation: 'pass', // 'pass' or 'fail' or score like 85
        explanation: 'Demonstrates clear understanding of vulnerability principles',
      },
      // For Challenge type
      scores: {
        structure: 8.5,
        emotion: 9.0,
        clarity: 8.0,
        relevance: 9.5,
      },
    },
  };

  const handleApprove = () => {
    // In real app: send approval to API
    console.log('Approved:', isEditing ? editedFeedback : submission.aiFeedback.original);
    onBack();
  };

  const handleReject = () => {
    if (!newFeedback.trim()) {
      alert('Please provide new feedback');
      return;
    }
    // In real app: send rejection and new feedback to API
    console.log('Rejected with reason:', rejectionReason);
    console.log('New feedback:', newFeedback);
    onBack();
  };

  const handleStartEdit = () => {
    setEditedFeedback(submission.aiFeedback.original);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    // In real app: save edited feedback
  };

  return (
    <div>
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Queue
      </Button>

      <PageHeader 
        title={`Grading Review - Day ${submission.user.currentDay}`}
        subtitle={`${submission.user.name} • ${submission.submittedDate}`}
        actions={
          <>
            <Button 
              variant="outline" 
              className="text-[var(--sf-red)] border-[var(--sf-red)] hover:bg-[var(--sf-red)] hover:text-white"
              onClick={() => setShowRejectForm(!showRejectForm)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject & Rewrite
            </Button>
            <Button 
              className="bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90"
              onClick={handleApprove}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve & Send
            </Button>
          </>
        }
      />

      {/* User Info Card */}
      <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-lg tracking-wide"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            USER INFORMATION
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--sf-text-muted)]" />
            <div>
              <p className="text-xs text-[var(--sf-text-muted)]">Name</p>
              <p className="text-sm font-medium">{submission.user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--sf-text-muted)]" />
            <div>
              <p className="text-xs text-[var(--sf-text-muted)]">Email</p>
              <p className="text-sm font-medium">{submission.user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--sf-text-muted)]" />
            <div>
              <p className="text-xs text-[var(--sf-text-muted)]">Current Day</p>
              <p className="text-sm font-medium">Day {submission.user.currentDay}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--sf-text-muted)]" />
            <div>
              <p className="text-xs text-[var(--sf-text-muted)]">Streak</p>
              <p className="text-sm font-medium">{submission.user.streak} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--sf-text-muted)]" />
            <div>
              <p className="text-xs text-[var(--sf-text-muted)]">Goal</p>
              <p className="text-sm font-medium">{submission.user.goal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Original Prompt */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Original {submission.type === 'qa' ? 'Question' : 'Challenge'} Prompt:
        </h4>
        <p className="text-sm text-blue-800">{submission.prompt}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Response */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-lg tracking-wide"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              USER RESPONSE
            </h3>
            <span className="text-sm text-[var(--sf-text-muted)]">
              {submission.responseType === 'audio' ? 'Audio + Transcription' : `${submission.response.split(' ').length} words`}
            </span>
          </div>

          {submission.responseType === 'audio' && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--sf-text-secondary)]">Original Audio Recording</span>
                <Button size="sm" variant="outline">
                  <Play className="w-3 h-3 mr-1" />
                  Play Audio
                </Button>
              </div>
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-[var(--sf-text-primary)] leading-relaxed whitespace-pre-line">
              {submission.response}
            </p>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--sf-orange)]" />
              <h3 
                className="text-lg tracking-wide"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                AI-GENERATED FEEDBACK
              </h3>
            </div>
            {!isEditing && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleStartEdit}
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </div>

          {!isEditing ? (
            <div className="prose max-w-none">
              <p className="text-[var(--sf-text-primary)] leading-relaxed whitespace-pre-line">
                {submission.aiFeedback.original}
              </p>
            </div>
          ) : (
            <div>
              <textarea 
                rows={12}
                className="w-full px-4 py-3 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] text-sm"
                value={editedFeedback}
                onChange={(e) => setEditedFeedback(e.target.value)}
              />
              <div className="flex items-center gap-2 mt-3">
                <Button 
                  size="sm" 
                  className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Evaluation Scores */}
      <div className="mt-6 bg-white rounded-lg border border-[var(--sf-border)] p-6">
        <h3 
          className="text-lg tracking-wide mb-4"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          {submission.type === 'qa' ? 'CORRECTNESS EVALUATION' : 'AI SCORING BREAKDOWN'}
        </h3>

        {submission.type === 'qa' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-[var(--sf-text-muted)] mb-1">Evaluation</p>
              <p 
                className="text-2xl text-[var(--sf-green)]"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {submission.aiFeedback.correctness.evaluation.toUpperCase()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-[var(--sf-text-muted)] mb-2">Explanation</p>
              <p className="text-sm text-[var(--sf-text-primary)]">
                {submission.aiFeedback.correctness.explanation}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(submission.aiFeedback.scores).map(([key, value]) => (
              <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-[var(--sf-text-muted)] mb-1 capitalize">{key}</p>
                <p 
                  className={`text-2xl ${
                    value >= 8.5 ? 'text-[var(--sf-green)]' : 
                    value >= 7.0 ? 'text-[var(--sf-orange)]' : 
                    'text-[var(--sf-red)]'
                  }`}
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  {value}/10
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject & Rewrite Form */}
      {showRejectForm && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 
            className="text-lg tracking-wide mb-4 text-red-900"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            REJECT AI FEEDBACK & WRITE NEW
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-red-900 mb-2">
                Rejection Reason (Internal Note)
              </label>
              <textarea 
                rows={2}
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                placeholder="Why is the AI feedback being rejected? (for tracking purposes)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-red-900 mb-2">
                New Feedback (Will be sent to user)
              </label>
              <textarea 
                rows={10}
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                placeholder="Write entirely new feedback for the user..."
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button 
                className="bg-[var(--sf-red)] hover:bg-[var(--sf-red)]/90"
                onClick={handleReject}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirm Rejection & Send New Feedback
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setShowRejectForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Information */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-[var(--sf-text-muted)]">
          <strong>Note:</strong> Upon approval, feedback will be queued for weekly batch delivery. 
          System tracks: original AI feedback, admin edits, and final approved version for quality improvement.
        </p>
      </div>
    </div>
  );
}
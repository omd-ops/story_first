import { 
  Award, 
  TrendingUp, 
  Users, 
  Download, 
  Upload, 
  Send, 
  Mail, 
  ExternalLink, 
  Eye, 
  X,
  Zap,
  Target,
  Trophy,
  Star,
  Gift,
  Filter,
  Webhook,
  Heart
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { PageHeader } from '../shared/PageHeader';

// Flame icon component
function Flame({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      className={className} 
      style={style}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

interface Milestone {
  id: number;
  name: string;
  description: string;
  icon: 'flame' | 'star' | 'trophy' | 'award';
  iconColor: string;
  iconBg: string;
  timesTriggered: number;
  likes: number;
  webhookEnabled: boolean;
  isActive: boolean;
  type: 'streak' | 'status' | 'completion';
}

interface RecentCelebration {
  id: number;
  userName: string;
  achievement: string;
  timeAgo: string;
  xpAwarded: number;
  milestoneId: number;
}

export function CelebrationDashboard() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewMilestone, setPreviewMilestone] = useState<Milestone | null>(null);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      name: '7-Day Streak',
      description: 'User completes 7 consecutive days',
      icon: 'flame',
      iconColor: '#FF6B35',
      iconBg: '#FFF5F3',
      timesTriggered: 156,
      likes: 10,
      webhookEnabled: true,
      isActive: true,
      type: 'streak'
    },
    {
      id: 2,
      name: '30-Day Streak',
      description: 'User completes 30 consecutive days',
      icon: 'flame',
      iconColor: '#FF6B35',
      iconBg: '#FFF5F3',
      timesTriggered: 47,
      likes: 5,
      webhookEnabled: true,
      isActive: true,
      type: 'streak'
    },
    {
      id: 3,
      name: 'Level Up',
      description: 'User reaches new status level',
      icon: 'star',
      iconColor: '#FFD700',
      iconBg: '#FFFEF0',
      timesTriggered: 89,
      likes: 20,
      webhookEnabled: true,
      isActive: true,
      type: 'status'
    },
    {
      id: 4,
      name: 'Journey Complete',
      description: 'User completes all 70 days',
      icon: 'trophy',
      iconColor: '#10B981',
      iconBg: '#F0FDF4',
      timesTriggered: 12,
      likes: 3,
      webhookEnabled: true,
      isActive: true,
      type: 'completion'
    },
  ]);

  const recentCelebrations: RecentCelebration[] = [
    { id: 1, userName: 'Sarah Johnson', achievement: '30-Day Streak', timeAgo: '2 hours ago', xpAwarded: 500, milestoneId: 2 },
    { id: 2, userName: 'Mike Chen', achievement: 'Level Up', timeAgo: '4 hours ago', xpAwarded: 200, milestoneId: 3 },
    { id: 3, userName: 'Emma Davis', achievement: '7-Day Streak', timeAgo: '6 hours ago', xpAwarded: 100, milestoneId: 1 },
    { id: 4, userName: 'Alex Thompson', achievement: 'Journey Complete', timeAgo: '1 day ago', xpAwarded: 1000, milestoneId: 4 },
  ];

  // Mock users who recently achieved milestones
  const usersWithMilestones = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', milestone: '30-Day Streak', achievedDate: 'Feb 9, 2026', xpAwarded: 500 },
    { id: 2, name: 'Mike Chen', email: 'mike.c@email.com', milestone: 'Level Up', achievedDate: 'Feb 9, 2026', xpAwarded: 200 },
    { id: 3, name: 'Emma Davis', email: 'emma.d@email.com', milestone: '7-Day Streak', achievedDate: 'Feb 9, 2026', xpAwarded: 100 },
    { id: 4, name: 'Alex Thompson', email: 'alex.t@email.com', milestone: 'Journey Complete', achievedDate: 'Feb 8, 2026', xpAwarded: 1000 },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'flame':
        return Flame;
      case 'star':
        return Star;
      case 'trophy':
        return Trophy;
      case 'award':
        return Award;
      default:
        return Award;
    }
  };

  const toggleMilestoneActive = (id: number) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const toggleWebhook = (id: number) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, webhookEnabled: !m.webhookEnabled } : m
    ));
  };

  const filteredMilestones = filterType === 'all' 
    ? milestones 
    : milestones.filter(m => m.type === filterType);

  const exportUsersList = () => {
    // Mock export functionality
    alert('Exporting user list for surprise and delight outreach...');
  };

  const openUsersModal = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowUsersModal(true);
  };

  const openPreviewModal = (milestone: Milestone) => {
    setPreviewMilestone(milestone);
    setShowPreviewModal(true);
  };

  return (
    <div>
      <PageHeader 
        title="Celebration Dashboard"
        subtitle="Manage milestones and celebration triggers"
        actions={
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowFilterModal(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button 
              className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
              onClick={() => setShowConfigModal(true)}
            >
              <Webhook className="w-4 h-4 mr-2" />
              Configure Webhooks
            </Button>
          </div>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4">
          <p className="text-sm text-[var(--sf-text-muted)] mb-1">Total Milestones</p>
          <p 
            className="text-3xl text-[var(--sf-text-primary)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {milestones.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4">
          <p className="text-sm text-[var(--sf-text-muted)] mb-1">Active Celebrations</p>
          <p 
            className="text-3xl text-[var(--sf-green)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {milestones.filter(m => m.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4">
          <p className="text-sm text-[var(--sf-text-muted)] mb-1">This Week</p>
          <p 
            className="text-3xl text-[var(--sf-orange)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {recentCelebrations.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4">
          <p className="text-sm text-[var(--sf-text-muted)] mb-1">Webhooks Active</p>
          <p 
            className="text-3xl text-blue-600"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {milestones.filter(m => m.webhookEnabled).length}
          </p>
        </div>
      </div>

      {/* Recent Celebrations */}
      <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-xl tracking-wide"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Recent Celebrations
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={exportUsersList}
          >
            <Download className="w-3 h-3 mr-2" />
            Export List
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentCelebrations.map(celebration => (
            <div 
              key={celebration.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[var(--sf-orange)]" />
                <div>
                  <p className="text-sm font-medium text-[var(--sf-text-primary)]">
                    {celebration.userName} achieved {celebration.achievement}
                  </p>
                  <p className="text-xs text-[var(--sf-text-muted)]">
                    {celebration.timeAgo}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-[var(--sf-orange)]">
                +{celebration.xpAwarded} XP
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Content Engagement */}
      <div className="mb-8">
        <h3 
          className="text-xl tracking-wide mb-4"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          Feed Content Engagement
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-[var(--sf-border)] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="text-xs tracking-wider text-[var(--sf-text-muted)]"
                    style={{ fontFamily: 'var(--font-bebas)' }}
                  >
                    Article
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    published
                  </span>
                </div>
                <h4 
                  className="text-base tracking-wide mb-1"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Unlock Your Creative Voice
                </h4>
                <p className="text-xs text-[var(--sf-text-muted)]">
                  By Coach Devon
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--sf-border)]">
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-current text-[var(--sf-red)]" />
                <span className="text-sm font-medium text-[var(--sf-red)]">56</span>
              </div>
              <div className="text-xs text-[var(--sf-text-muted)]">1,234 views</div>
            </div>
          </div>

          <div className="bg-white border border-[var(--sf-border)] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="text-xs tracking-wider text-[var(--sf-text-muted)]"
                    style={{ fontFamily: 'var(--font-bebas)' }}
                  >
                    Challenge
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    published
                  </span>
                </div>
                <h4 
                  className="text-base tracking-wide mb-1"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Weekly Writing Challenge
                </h4>
                <p className="text-xs text-[var(--sf-text-muted)]">
                  By StoryFirst Team
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--sf-border)]">
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-current text-[var(--sf-red)]" />
                <span className="text-sm font-medium text-[var(--sf-red)]">34</span>
              </div>
              <div className="text-xs text-[var(--sf-text-muted)]">856 views</div>
            </div>
          </div>

          <div className="bg-white border border-[var(--sf-border)] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="text-xs tracking-wider text-[var(--sf-text-muted)]"
                    style={{ fontFamily: 'var(--font-bebas)' }}
                  >
                    Tips
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    published
                  </span>
                </div>
                <h4 
                  className="text-base tracking-wide mb-1"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Character Development Tips
                </h4>
                <p className="text-xs text-[var(--sf-text-muted)]">
                  By StoryFirst Team
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--sf-border)]">
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-current text-[var(--sf-red)]" />
                <span className="text-sm font-medium text-[var(--sf-red)]">78</span>
              </div>
              <div className="text-xs text-[var(--sf-text-muted)]">2,145 views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {filteredMilestones.map(milestone => {
          const IconComponent = getIcon(milestone.icon);
          return (
            <div 
              key={milestone.id} 
              className="bg-white rounded-lg border border-[var(--sf-border)] p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: milestone.iconBg }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: milestone.iconColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="text-base tracking-wide mb-1"
                      style={{ fontFamily: 'var(--font-bebas)' }}
                    >
                      {milestone.name}
                    </h3>
                    <p className="text-xs text-[var(--sf-text-muted)]">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleMilestoneActive(milestone.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    milestone.isActive ? 'bg-[var(--sf-green)]' : 'bg-gray-300'
                  }`}
                >
                  <div 
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                      milestone.isActive ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--sf-border)] mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-[var(--sf-text-muted)] mb-1">Times Triggered</p>
                    <p 
                      className="text-xl text-[var(--sf-text-primary)]"
                      style={{ fontFamily: 'var(--font-bebas)' }}
                    >
                      {milestone.timesTriggered}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--sf-text-muted)] mb-1">Likes</p>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-current text-[var(--sf-red)]" />
                      <p 
                        className="text-xl text-[var(--sf-red)]"
                        style={{ fontFamily: 'var(--font-bebas)' }}
                      >
                        {milestone.likes}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--sf-text-muted)] mb-1">Webhook</p>
                    <p 
                      className={`text-xs font-medium ${
                        milestone.webhookEnabled ? 'text-[var(--sf-green)]' : 'text-gray-400'
                      }`}
                    >
                      {milestone.webhookEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openPreviewModal(milestone)}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openUsersModal(milestone)}
                >
                  View Users
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <h2 
                className="text-2xl tracking-wide"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                FILTER MILESTONES
              </h2>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <button
                onClick={() => {
                  setFilterType('all');
                  setShowFilterModal(false);
                }}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  filterType === 'all' 
                    ? 'bg-[var(--sf-orange)] text-white' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">All Milestones</div>
                <div className="text-sm opacity-80">Show all celebration types</div>
              </button>
              
              <button
                onClick={() => {
                  setFilterType('streak');
                  setShowFilterModal(false);
                }}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  filterType === 'streak' 
                    ? 'bg-[var(--sf-orange)] text-white' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">Streak Milestones</div>
                <div className="text-sm opacity-80">7-day, 30-day consecutive days</div>
              </button>

              <button
                onClick={() => {
                  setFilterType('status');
                  setShowFilterModal(false);
                }}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  filterType === 'status' 
                    ? 'bg-[var(--sf-orange)] text-white' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">Status Changes</div>
                <div className="text-sm opacity-80">Level ups, badge achievements</div>
              </button>

              <button
                onClick={() => {
                  setFilterType('completion');
                  setShowFilterModal(false);
                }}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  filterType === 'completion' 
                    ? 'bg-[var(--sf-orange)] text-white' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">Journey Completion</div>
                <div className="text-sm opacity-80">70-day journey complete</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Webhooks Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <h2 
                className="text-2xl tracking-wide"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                CONFIGURE WEBHOOKS & NOTIFICATIONS
              </h2>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--sf-text-secondary)] mb-2">
                  Webhook URL
                </label>
                <input 
                  type="url"
                  placeholder="https://api.example.com/webhooks/celebrations"
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                />
                <p className="text-xs text-[var(--sf-text-muted)] mt-1">
                  Receive real-time notifications when users hit milestones
                </p>
              </div>

              <div>
                <h3 
                  className="text-lg tracking-wide mb-3"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  MILESTONE NOTIFICATIONS
                </h3>
                <div className="space-y-2">
                  {milestones.map(milestone => (
                    <div 
                      key={milestone.id}
                      className="flex items-center justify-between p-3 border border-[var(--sf-border)] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded flex items-center justify-center"
                          style={{ backgroundColor: milestone.iconBg }}
                        >
                          {(() => {
                            const IconComponent = getIcon(milestone.icon);
                            return <IconComponent className="w-4 h-4" style={{ color: milestone.iconColor }} />;
                          })()}
                        </div>
                        <span className="text-sm font-medium">{milestone.name}</span>
                      </div>
                      <button
                        onClick={() => toggleWebhook(milestone.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          milestone.webhookEnabled
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {milestone.webhookEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 
                  className="text-lg tracking-wide mb-3"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  EMAIL TEMPLATES
                </h3>
                <div className="space-y-3">
                  <button className="w-full p-4 border-2 border-[var(--sf-border)] rounded-lg hover:border-[var(--sf-orange)] transition-colors text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[var(--sf-orange)]" />
                        <div>
                          <div className="font-medium">Streak Achievement Email</div>
                          <div className="text-sm text-[var(--sf-text-muted)]">Sent when users complete 7 or 30-day streaks</div>
                        </div>
                      </div>
                      <span className="text-sm text-[var(--sf-orange)]">Edit →</span>
                    </div>
                  </button>

                  <button className="w-full p-4 border-2 border-[var(--sf-border)] rounded-lg hover:border-[var(--sf-orange)] transition-colors text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[var(--sf-orange)]" />
                        <div>
                          <div className="font-medium">Journey Complete Email</div>
                          <div className="text-sm text-[var(--sf-text-muted)]">Sent when users finish all 70 days</div>
                        </div>
                      </div>
                      <span className="text-sm text-[var(--sf-orange)]">Edit →</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowConfigModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                  onClick={() => setShowConfigModal(false)}
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Users Modal */}
      {showUsersModal && selectedMilestone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <div>
                <h2 
                  className="text-2xl tracking-wide"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  USERS WITH {selectedMilestone.name.toUpperCase()}
                </h2>
                <p className="text-sm text-[var(--sf-text-muted)] mt-1">
                  {usersWithMilestones.length} users achieved this milestone
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowUsersModal(false);
                  setSelectedMilestone(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-3">
                {usersWithMilestones.map(user => (
                  <div 
                    key={user.id}
                    className="bg-white border border-[var(--sf-border)] rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-[var(--sf-text-primary)]">{user.name}</p>
                        <span className="text-sm text-[var(--sf-text-muted)]">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[var(--sf-text-secondary)]">Achieved: {user.achievedDate}</span>
                        <span className="text-sm text-[var(--sf-text-muted)]">•</span>
                        <span className="text-[var(--sf-orange)] font-medium">+{user.xpAwarded} XP</span>
                      </div>
                    </div>
                    <div className="text-[var(--sf-text-muted)] text-sm">
                      View Profile →
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--sf-border)] flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={exportUsersList}
              >
                <Download className="w-4 h-4 mr-2" />
                Export for Outreach
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowUsersModal(false);
                  setSelectedMilestone(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Celebration Animation Modal */}
      {showPreviewModal && previewMilestone && (() => {
        const IconComponent = getIcon(previewMilestone.icon);
        return (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowPreviewModal(false);
              setPreviewMilestone(null);
            }}
          >
            <div 
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-12 relative overflow-hidden rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                {/* Confetti/Sparkles Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 20}%`,
                        backgroundColor: ['#FFD700', '#FF6B35', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)],
                        animation: `float ${2 + Math.random() * 3}s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                        opacity: 0.8
                      }}
                    />
                  ))}
                </div>

                {/* Main Celebration Content */}
                <div className="relative z-10 text-center">
                  {/* Animated Icon */}
                  <div className="flex justify-center mb-6">
                    <div 
                      className="w-32 h-32 rounded-full flex items-center justify-center animate-bounce"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        animation: 'bounce 1s ease-in-out infinite'
                      }}
                    >
                      <IconComponent 
                        className="w-20 h-20" 
                        style={{ color: previewMilestone.iconColor }}
                      />
                    </div>
                  </div>

                  {/* Celebration Text */}
                  <h3 
                    className="text-6xl tracking-wide text-white mb-3 animate-pulse"
                    style={{ 
                      fontFamily: 'var(--font-bebas)',
                      textShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {previewMilestone.name}!
                  </h3>
                  <p className="text-xl text-white/90 mb-6" style={{ textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }}>
                    {previewMilestone.description}
                  </p>

                  {/* XP Award */}
                  <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 border-2 border-white/40">
                    <p 
                      className="text-4xl text-white"
                      style={{ fontFamily: 'var(--font-bebas)' }}
                    >
                      +{previewMilestone.timesTriggered * 10} XP
                    </p>
                  </div>

                  {/* Achievement Badge */}
                  <div className="mt-8 flex justify-center gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-white/60"
                        style={{
                          animation: `pulse 1.5s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <style>{`
                  @keyframes float {
                    0% {
                      transform: translateY(0) rotate(0deg);
                      opacity: 0;
                    }
                    10% {
                      opacity: 1;
                    }
                    90% {
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(100vh) rotate(360deg);
                      opacity: 0;
                    }
                  }
                  @keyframes bounce {
                    0%, 100% {
                      transform: translateY(-5%);
                      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
                    }
                    50% {
                      transform: translateY(0);
                      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
                    }
                  }
                  @keyframes pulse {
                    0%, 100% {
                      opacity: 1;
                      transform: scale(1);
                    }
                    50% {
                      opacity: 0.5;
                      transform: scale(1.5);
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
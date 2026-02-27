import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { ArrowLeft, Edit, Save, AlertCircle, Play, Pause, Award, MessageSquare, Target, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

interface UserDetailManagementProps {
  userId: number;
  onBack: () => void;
}

interface PauseTokenHistory {
  id: number;
  date: string;
  action: 'earned' | 'consumed';
  reason: string;
}

interface Response {
  id: number;
  day: number;
  type: 'Q&A' | 'Challenge';
  content: string;
  completedDate: string;
  status: 'completed';
}

export function UserDetailManagement({ userId, onBack }: UserDetailManagementProps) {
  // User data - in real app would fetch based on userId
  const [userData, setUserData] = useState({
    id: userId,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    status: 2,
    xp: 1450,
    streak: 28,
    pauseTokens: 2,
    circleAssigned: true,
    circleName: 'Circle Alpha',
    joinedDate: 'Jan 5, 2026',
    lastActive: '2 hours ago',
    sequentialUnlock: false,
    currentDay: 28,
    completedDays: 27,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData.name);
  const [editedEmail, setEditedEmail] = useState(userData.email);
  const [editedPhone, setEditedPhone] = useState(userData.phone);
  const [editedStatus, setEditedStatus] = useState(userData.status);
  const [editedTokens, setEditedTokens] = useState(userData.pauseTokens);
  const [editedSequential, setEditedSequential] = useState(userData.sequentialUnlock);

  const [tokenHistory] = useState<PauseTokenHistory[]>([
    { id: 1, date: 'Feb 1, 2026', action: 'earned', reason: 'Reached Status 2' },
    { id: 2, date: 'Jan 25, 2026', action: 'consumed', reason: 'Paused Day 23' },
    { id: 3, date: 'Jan 15, 2026', action: 'earned', reason: 'Reached Status 1' },
    { id: 4, date: 'Jan 5, 2026', action: 'earned', reason: 'Account creation (3 tokens)' },
  ]);

  const [responses] = useState<Response[]>([
    { 
      id: 1, 
      day: 27, 
      type: 'Q&A', 
      content: 'Today I shared a story about my grandmother\'s journey...', 
      completedDate: 'Feb 8, 2026',
      status: 'completed'
    },
    { 
      id: 2, 
      day: 27, 
      type: 'Challenge', 
      content: 'I practiced storytelling with three different emotions...', 
      completedDate: 'Feb 8, 2026',
      status: 'completed'
    },
    { 
      id: 3, 
      day: 26, 
      type: 'Q&A', 
      content: 'The most memorable story I heard was from my friend...', 
      completedDate: 'Feb 7, 2026',
      status: 'completed'
    },
  ]);

  const handleSave = () => {
    setUserData({
      ...userData,
      name: editedName,
      email: editedEmail,
      phone: editedPhone,
      status: editedStatus,
      pauseTokens: editedTokens,
      sequentialUnlock: editedSequential,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(userData.name);
    setEditedEmail(userData.email);
    setEditedPhone(userData.phone);
    setEditedStatus(userData.status);
    setEditedTokens(userData.pauseTokens);
    setEditedSequential(userData.sequentialUnlock);
    setIsEditing(false);
  };

  const getStatusBadgeColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-blue-100 text-blue-700';
      case 2: return 'bg-green-100 text-green-700';
      case 3: return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <PageHeader 
        title={userData.name.toUpperCase()}
        subtitle={`User ID: ${userData.id} · Joined ${userData.joinedDate}`}
        actions={
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Quick Stats and Alerts - Horizontal at top */}
        <div className="grid grid-cols-12 gap-6">
          {/* Quick Stats */}
          <div className="col-span-8 bg-white border border-[var(--sf-border)] p-6">
            <h3 
              className="text-lg tracking-wide mb-4"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              QUICK STATS
            </h3>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <span className="text-sm text-[var(--sf-text-secondary)] block mb-1">Grading</span>
                <span className="text-xl font-medium block" style={{ fontFamily: 'var(--font-bebas)' }}>3</span>
              </div>
              <div className="text-center">
                <span className="text-sm text-[var(--sf-text-secondary)] block mb-1">Login Streak</span>
                <span className="text-xl font-medium block" style={{ fontFamily: 'var(--font-bebas)' }}>{userData.streak} days</span>
              </div>
              <div className="text-center">
                <span className="text-sm text-[var(--sf-text-secondary)] block mb-1">Total Lessons</span>
                <span className="text-xl font-medium block" style={{ fontFamily: 'var(--font-bebas)' }}>{userData.completedDays}/70</span>
              </div>
            </div>
          </div>

          {/* Alerts & Flags */}
          <div className="col-span-4 bg-white border border-[var(--sf-border)] p-6">
            <h3 
              className="text-lg tracking-wide mb-4"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              ALERTS & FLAGS
            </h3>

            <div className="space-y-3">
              {!userData.circleAssigned ? (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Circle Assignment Needed</p>
                    <p className="text-xs text-red-700 mt-1">User has reached point threshold</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200">
                  <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">All Clear</p>
                    <p className="text-xs text-green-700 mt-1">No action items for this user</p>
                  </div>
                </div>
              )}

              {userData.sequentialUnlock && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200">
                  <Play className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Sequential Mode Active</p>
                    <p className="text-xs text-blue-700 mt-1">Can complete multiple lessons/day</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Info and Sequential Unlock - Full Width */}
        <div className="grid grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-white border border-[var(--sf-border)] p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 
                  className="text-xl tracking-wide mb-2"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  USER INFORMATION
                </h3>
                {!isEditing && (
                  <>
                    <p className="text-sm text-[var(--sf-text-secondary)]">{userData.email}</p>
                    <p className="text-sm text-[var(--sf-text-secondary)]">{userData.phone}</p>
                  </>
                )}
              </div>
              {!isEditing ? (
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[var(--sf-green)] hover:bg-[var(--sf-green)]/90"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {isEditing && (
                <>
                  <div className="col-span-2">
                    <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Name</label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-4 py-2 border border-[var(--sf-border)] focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Email</label>
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-[var(--sf-border)] focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-[var(--sf-border)] focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Status Level</label>
                {isEditing ? (
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-[var(--sf-border)] focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                  >
                    <option value={1}>Status 1</option>
                    <option value={2}>Status 2</option>
                    <option value={3}>Status 3</option>
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-1 text-sm font-medium ${getStatusBadgeColor(userData.status)}`}>
                    Status {userData.status}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Current Progress</label>
                <p className="text-sm font-medium">Day {userData.currentDay} of 70</p>
                <p className="text-xs text-[var(--sf-text-muted)] mt-1">{userData.completedDays} days completed</p>
              </div>

              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">XP</label>
                <p className="text-sm font-medium">{userData.xp.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Streak</label>
                <p className="text-sm font-medium">{userData.streak} days</p>
              </div>

              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Circle</label>
                {userData.circleAssigned ? (
                  <p className="text-sm font-medium text-green-600">{userData.circleName}</p>
                ) : (
                  <p className="text-sm text-[var(--sf-text-muted)]">Not assigned</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Last Active</label>
                <p className="text-sm font-medium">{userData.lastActive}</p>
              </div>
            </div>
          </div>

          {/* Sequential Unlock Override */}
          <div className="bg-white border border-[var(--sf-border)] p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 
                  className="text-lg tracking-wide mb-2"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  SEQUENTIAL UNLOCK MODE
                </h3>
                <p className="text-sm text-[var(--sf-text-secondary)]">
                  Allow user to access lessons sequentially without daily unlock restrictions
                </p>
              </div>
              <div className={`px-3 py-1 text-xs font-medium ${
                userData.sequentialUnlock 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {userData.sequentialUnlock ? 'Enabled' : 'Disabled'}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2 text-sm">
                <Play className="w-4 h-4 text-[var(--sf-text-muted)] mt-0.5 flex-shrink-0" />
                <span>User can complete multiple lessons per day</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Play className="w-4 h-4 text-[var(--sf-text-muted)] mt-0.5 flex-shrink-0" />
                <span>Next lesson unlocks immediately after Q&A completion</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Play className="w-4 h-4 text-[var(--sf-text-muted)] mt-0.5 flex-shrink-0" />
                <span>No 12:01am timezone wait between lessons</span>
              </div>
            </div>

            <label className="flex items-center justify-between p-4 border-2 border-[var(--sf-border)] cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <span className="text-sm font-medium block mb-1">
                  {userData.sequentialUnlock ? 'Disable' : 'Enable'} Sequential Unlock Mode
                </span>
                <span className="text-xs text-[var(--sf-text-muted)]">
                  {userData.sequentialUnlock 
                    ? 'User will return to standard daily unlock schedule' 
                    : 'User can progress through lessons without waiting'}
                </span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={userData.sequentialUnlock}
                  onChange={(e) => {
                    setUserData({
                      ...userData,
                      sequentialUnlock: e.target.checked
                    });
                  }}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 transition-colors ${
                  userData.sequentialUnlock ? 'bg-[var(--sf-green)]' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white transition-transform ${
                    userData.sequentialUnlock ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Two-column layout for remaining content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Pause Token Management */}
          <div className="bg-white border border-[var(--sf-border)] p-6">
            <h3 
              className="text-lg tracking-wide mb-4"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              PAUSE TOKEN MANAGEMENT
            </h3>

            <div className="space-y-4 mb-6">
              <div className="p-4 border border-[var(--sf-border)]">
                <p className="text-sm text-[var(--sf-text-secondary)] mb-2">Current Tokens</p>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUserData({ ...userData, pauseTokens: Math.max(0, userData.pauseTokens - 1) })}
                    className="h-10 w-10 p-0 text-lg"
                  >
                    -
                  </Button>
                  <div className="flex-1 flex items-center justify-center">
                    <p 
                      className="text-3xl"
                      style={{ fontFamily: 'var(--font-bebas)' }}
                    >
                      {userData.pauseTokens}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUserData({ ...userData, pauseTokens: userData.pauseTokens + 1 })}
                    className="h-10 w-10 p-0 text-lg"
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-[var(--sf-text-muted)] mt-2">Manual override: Add or remove tokens</p>
              </div>

              <div className="p-4 border border-[var(--sf-border)]">
                <p className="text-sm text-[var(--sf-text-secondary)] mb-1">Total Earned</p>
                <p 
                  className="text-3xl"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  {tokenHistory.filter(t => t.action === 'earned').length}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[var(--sf-text-secondary)] mb-3">Token History</h4>
              <div className="space-y-2">
                {tokenHistory.map(item => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-[var(--sf-border)]"
                  >
                    <div className="flex items-center gap-3">
                      {item.action === 'earned' ? (
                        <div className="w-8 h-8 bg-green-100 flex items-center justify-center">
                          <Award className="w-4 h-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-orange-100 flex items-center justify-center">
                          <Pause className="w-4 h-4 text-orange-600" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium capitalize">{item.action}</p>
                        <p className="text-xs text-[var(--sf-text-muted)]">{item.reason}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--sf-text-secondary)]">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Responses */}
          <div className="bg-white border border-[var(--sf-border)] p-6">
            <h3 
              className="text-lg tracking-wide mb-4"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              USER RESPONSES
            </h3>

            <div className="space-y-3">
              {responses.map(response => (
                <div 
                  key={response.id}
                  className="p-4 border border-[var(--sf-border)] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {response.type === 'Q&A' ? (
                        <MessageSquare className="w-4 h-4 text-[var(--sf-blue)]" />
                      ) : (
                        <Target className="w-4 h-4 text-[var(--sf-orange)]" />
                      )}
                      <span className="text-sm font-medium">Day {response.day} - {response.type}</span>
                    </div>
                    <span className="text-xs text-[var(--sf-text-muted)]">{response.completedDate}</span>
                  </div>
                  <p className="text-sm text-[var(--sf-text-secondary)]">{response.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
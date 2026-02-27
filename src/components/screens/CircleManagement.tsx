import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { Plus, Users, AlertCircle, Target, X, Trash2, UserMinus, Search, UserCheck } from 'lucide-react';
import { useState } from 'react';

export function CircleManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'members' | 'manage' | null>(null);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showAssignCircleModal, setShowAssignCircleModal] = useState(false);
  const [userToAssign, setUserToAssign] = useState<any>(null);
  const [circleMembers, setCircleMembers] = useState<any[]>([]);

  // Seven default circles (one per goal type) - these are system-created
  const defaultCircles = [
    { 
      id: 1, 
      name: 'Writers Guild', 
      members: 24, 
      active: 18, 
      created: 'Jan 15, 2026', 
      description: 'Professional writers focused on long-form storytelling',
      goalType: 'Master storytelling craft',
      isDefault: true
    },
    { 
      id: 2, 
      name: 'Beginners Journey', 
      members: 45, 
      active: 38, 
      created: 'Jan 20, 2026', 
      description: 'New storytellers starting their practice',
      goalType: 'Build daily writing habit',
      isDefault: true
    },
    { 
      id: 3, 
      name: 'Advanced Storytellers', 
      members: 12, 
      active: 11, 
      created: 'Jan 22, 2026', 
      description: 'Experienced writers working on advanced techniques',
      goalType: 'Improve communication skills',
      isDefault: true
    },
    { 
      id: 4, 
      name: 'Creative Entrepreneurs', 
      members: 31, 
      active: 25, 
      created: 'Feb 1, 2026', 
      description: 'Business owners using storytelling for brand building',
      goalType: 'Build personal brand',
      isDefault: true
    },
    { 
      id: 5, 
      name: 'Public Speakers Circle', 
      members: 18, 
      active: 14, 
      created: 'Jan 18, 2026', 
      description: 'Members developing confident public speaking through stories',
      goalType: 'Prepare for speaking event',
      isDefault: true
    },
    { 
      id: 6, 
      name: 'Career Storytellers', 
      members: 22, 
      active: 19, 
      created: 'Jan 25, 2026', 
      description: 'Professionals crafting compelling career narratives',
      goalType: 'Advance my career',
      isDefault: true
    },
    { 
      id: 7, 
      name: 'Creative Expression Lab', 
      members: 16, 
      active: 13, 
      created: 'Feb 5, 2026', 
      description: 'Artists and creators exploring storytelling as creative outlet',
      goalType: 'Express myself creatively',
      isDefault: true
    },
  ];

  // Custom circles (admin-created for specific groups)
  const customCircles = [
    { 
      id: 101, 
      name: 'DevSavant Team', 
      members: 8, 
      active: 8, 
      created: 'Feb 8, 2026', 
      description: 'Internal team members from DevSavant organization',
      goalType: null,
      isDefault: false,
      isCustom: true
    },
    { 
      id: 102, 
      name: 'Marketing Professionals', 
      members: 15, 
      active: 12, 
      created: 'Feb 3, 2026', 
      description: 'Marketing and content professionals improving storytelling',
      goalType: null,
      isDefault: false,
      isCustom: true
    },
  ];

  // Users who need circle assignment (reached thresholds but not assigned)
  const usersNeedingAssignment = [
    { id: 1, name: 'Michael Chen', email: 'michael.chen@email.com', points: 1200, goalType: 'Master storytelling craft', reason: 'Reached 1000 points' },
    { id: 2, name: 'Emma Rodriguez', email: 'emma.r@email.com', points: 850, goalType: 'Build daily writing habit', reason: 'Requested circle access' },
    { id: 3, name: 'David Kim', email: 'david.kim@email.com', points: 1500, goalType: 'Advance my career', reason: 'Completed 30-day streak' },
  ];

  // Mock members data
  const mockMembers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', joinedDate: 'Jan 15, 2026', status: 'Active', streak: 28 },
    { id: 2, name: 'Alex Martinez', email: 'alex.m@email.com', joinedDate: 'Jan 18, 2026', status: 'Active', streak: 15 },
    { id: 3, name: 'Emily Chen', email: 'emily.c@email.com', joinedDate: 'Jan 22, 2026', status: 'Inactive', streak: 0 },
    { id: 4, name: 'Jordan Williams', email: 'jordan.w@email.com', joinedDate: 'Feb 1, 2026', status: 'Active', streak: 7 },
    { id: 5, name: 'Taylor Brown', email: 'taylor.b@email.com', joinedDate: 'Feb 5, 2026', status: 'Active', streak: 4 },
  ];

  // Available users to add to circle
  const availableUsers = [
    { id: 101, name: 'Rachel Green', email: 'rachel.g@email.com', status: 'Active', currentDay: 12 },
    { id: 102, name: 'Ross Geller', email: 'ross.g@email.com', status: 'Active', currentDay: 8 },
    { id: 103, name: 'Monica Bing', email: 'monica.b@email.com', status: 'Active', currentDay: 22 },
    { id: 104, name: 'Chandler Bing', email: 'chandler.b@email.com', status: 'Active', currentDay: 15 },
    { id: 105, name: 'Joey Tribbiani', email: 'joey.t@email.com', status: 'Active', currentDay: 5 },
    { id: 106, name: 'Phoebe Buffay', email: 'phoebe.b@email.com', status: 'Active', currentDay: 18 },
  ];

  const allCircles = [...defaultCircles, ...customCircles];
  const currentCircle = allCircles.find(c => c.id === selectedCircle);

  const closeModal = () => {
    setViewMode(null);
    setSelectedCircle(null);
  };

  return (
    <div>
      <PageHeader 
        title="Circle Management"
        subtitle="Manage user groups and communities"
        actions={
          <Button 
            className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Circle
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4">
          <p className="text-sm text-[var(--sf-text-muted)] mb-1">Total Circles</p>
          <p 
            className="text-3xl text-[var(--sf-text-primary)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {allCircles.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4">
          <p className="text-sm text-[var(--sf-text-muted)] mb-1">Default Circles</p>
          <p 
            className="text-3xl text-blue-600"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {defaultCircles.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4">
          <p className="text-sm text-[var(--sf-text-muted)] mb-1">Custom Circles</p>
          <p 
            className="text-3xl text-purple-600"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {customCircles.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-4">
          <p className="text-sm text-[var(--sf-text-muted)] mb-1">Pending Assignments</p>
          <p 
            className="text-3xl text-yellow-600"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {usersNeedingAssignment.length}
          </p>
        </div>
      </div>

      {/* Users Needing Circle Assignment - Visual Flags */}
      {usersNeedingAssignment.length > 0 && (
        <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-700" />
            <h3 
              className="text-lg tracking-wide text-yellow-900"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              USERS NEEDING CIRCLE ASSIGNMENT ({usersNeedingAssignment.length})
            </h3>
          </div>
          <p className="text-sm text-yellow-800 mb-4">
            These users have reached thresholds or requested circle access but haven't been assigned yet.
          </p>
          
          <div className="space-y-3">
            {usersNeedingAssignment.map(user => (
              <div 
                key={user.id} 
                className="bg-white rounded-lg border border-yellow-200 p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-[var(--sf-text-primary)]">{user.name}</p>
                    <span className="text-sm text-[var(--sf-text-muted)]">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-[var(--sf-text-muted)]" />
                      <span className="text-[var(--sf-text-secondary)]">{user.goalType}</span>
                    </div>
                    <span className="text-[var(--sf-text-muted)]">•</span>
                    <span className="text-[var(--sf-orange)] font-medium">{user.points} points</span>
                    <span className="text-[var(--sf-text-muted)]">•</span>
                    <span className="text-yellow-700 text-xs italic">{user.reason}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                  onClick={() => {
                    setUserToAssign(user);
                    setShowAssignCircleModal(true);
                  }}
                >
                  Assign to Circle
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allCircles.map(circle => (
          <div key={circle.id} className="bg-white rounded-lg border border-[var(--sf-border)] p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 
                  className="text-xl tracking-wide"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  {circle.name}
                </h3>
                {circle.isDefault && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Default
                  </span>
                )}
                {circle.isCustom && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    Custom
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--sf-text-muted)]">
                Created {circle.created}
                {circle.goalType && (
                  <span className="text-[var(--sf-text-secondary)]">
                    {' '}• Goal: {circle.goalType}
                  </span>
                )}
              </p>
            </div>

            <p className="text-sm text-[var(--sf-text-secondary)] mb-4">
              {circle.description}
            </p>

            <div className="flex items-center gap-6 mb-4">
              <div>
                <p className="text-sm text-[var(--sf-text-muted)]">Total Members</p>
                <p 
                  className="text-2xl text-[var(--sf-text-primary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  {circle.members}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--sf-text-muted)]">Active</p>
                <p 
                  className="text-2xl text-[var(--sf-green)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  {circle.active}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedCircle(circle.id);
                  setViewMode('members');
                }}
              >
                <Users className="w-3 h-3 mr-1" />
                View Members
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                onClick={() => {
                  setSelectedCircle(circle.id);
                  setViewMode('manage');
                }}
              >
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <h2 
                className="text-2xl tracking-wide"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                CREATE NEW CIRCLE
              </h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--sf-text-secondary)] mb-2">
                  Circle Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g., DevSavant Team, Marketing Professionals"
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--sf-text-secondary)] mb-2">
                  Description
                </label>
                <textarea 
                  placeholder="Describe the purpose and focus of this circle..."
                  rows={3}
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--sf-text-secondary)] mb-2">
                  Circle Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 border-2 border-purple-200 bg-purple-50 rounded-lg hover:border-purple-400 transition-colors">
                    <div className="text-left">
                      <div className="font-medium text-purple-900">Custom Circle</div>
                      <div className="text-sm text-purple-700">Organization or team-specific</div>
                    </div>
                  </button>
                  <button className="p-4 border-2 border-gray-200 bg-gray-50 rounded-lg hover:border-gray-400 transition-colors">
                    <div className="text-left">
                      <div className="font-medium text-[var(--sf-text-primary)]">Goal-Based Circle</div>
                      <div className="text-sm text-[var(--sf-text-muted)]">Linked to a specific goal type</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                  onClick={() => {
                    // Handle create circle
                    setShowCreateModal(false);
                  }}
                >
                  Create Circle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Members Modal */}
      {viewMode === 'members' && currentCircle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <div>
                <h2 
                  className="text-2xl tracking-wide"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  {currentCircle.name} - MEMBERS
                </h2>
                <p className="text-sm text-[var(--sf-text-muted)] mt-1">{currentCircle.members} total members</p>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-3">
                {mockMembers.map(member => (
                  <div 
                    key={member.id}
                    className="bg-white border border-[var(--sf-border)] rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-[var(--sf-text-primary)]">{member.name}</p>
                        <span className="text-sm text-[var(--sf-text-muted)]">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[var(--sf-text-secondary)]">Joined: {member.joinedDate}</span>
                        <span className="text-[var(--sf-text-muted)]">•</span>
                        <span className={member.status === 'Active' ? 'text-[var(--sf-green)]' : 'text-[var(--sf-text-muted)]'}>
                          {member.status}
                        </span>
                        <span className="text-[var(--sf-text-muted)]">•</span>
                        <span className="text-[var(--sf-text-secondary)]">Streak: {member.streak} days</span>
                      </div>
                    </div>
                    <div className="text-[var(--sf-text-muted)] text-sm">
                      View Profile →
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--sf-border)]">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={closeModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Circle Modal */}
      {viewMode === 'manage' && currentCircle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <div>
                <h2 
                  className="text-2xl tracking-wide"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  MANAGE: {currentCircle.name}
                </h2>
                <p className="text-sm text-[var(--sf-text-muted)] mt-1">Add or remove members</p>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <Button 
                  className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90 mb-4"
                  onClick={() => setShowAddMembersModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Members
                </Button>
              </div>

              <h3 
                className="text-lg tracking-wide mb-4"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                CURRENT MEMBERS
              </h3>

              <div className="space-y-3">
                {mockMembers.map(member => (
                  <div 
                    key={member.id}
                    className="bg-white border border-[var(--sf-border)] rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-[var(--sf-text-primary)]">{member.name}</p>
                        <span className="text-sm text-[var(--sf-text-muted)]">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[var(--sf-text-secondary)]">Joined: {member.joinedDate}</span>
                        <span className="text-[var(--sf-text-muted)]">•</span>
                        <span className={member.status === 'Active' ? 'text-[var(--sf-green)]' : 'text-[var(--sf-text-muted)]'}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        const confirmed = window.confirm(`Are you sure you want to remove ${member.name} from ${currentCircle.name}?`);
                        if (confirmed) {
                          alert(`${member.name} has been removed from ${currentCircle.name}`);
                        }
                      }}
                    >
                      <UserMinus className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--sf-border)] flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={closeModal}
              >
                Close
              </Button>
              <Button 
                className="flex-1 bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                onClick={closeModal}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMembersModal && currentCircle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <div>
                <h2 
                  className="text-2xl tracking-wide"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  ADD MEMBERS TO {currentCircle.name}
                </h2>
                <p className="text-sm text-[var(--sf-text-muted)] mt-1">Select users to add to this circle</p>
              </div>
              <button 
                onClick={() => setShowAddMembersModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--sf-text-muted)]" />
                  <input 
                    type="text"
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                  />
                </div>
              </div>

              {/* Available Users List */}
              <div className="space-y-3">
                {availableUsers.map(user => (
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
                        <span className="text-[var(--sf-text-secondary)]">Status: {user.status}</span>
                        <span className="text-[var(--sf-text-muted)]">•</span>
                        <span className="text-[var(--sf-text-secondary)]">Day {user.currentDay}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                      onClick={() => {
                        alert(`${user.name} has been added to ${currentCircle.name}`);
                        setShowAddMembersModal(false);
                      }}
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--sf-border)]">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowAddMembersModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Circle Modal */}
      {showAssignCircleModal && userToAssign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <div>
                <h2 
                  className="text-2xl tracking-wide"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  ASSIGN CIRCLE TO {userToAssign.name}
                </h2>
                <p className="text-sm text-[var(--sf-text-muted)] mt-1">Select a circle to assign to this user</p>
              </div>
              <button 
                onClick={() => setShowAssignCircleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--sf-text-muted)]" />
                  <input 
                    type="text"
                    placeholder="Search circles by name..."
                    className="w-full pl-10 pr-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                  />
                </div>
              </div>

              {/* Available Circles List */}
              <div className="space-y-3">
                {allCircles.map(circle => (
                  <div 
                    key={circle.id}
                    className="bg-white border border-[var(--sf-border)] rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-[var(--sf-text-primary)]">{circle.name}</p>
                        <span className="text-sm text-[var(--sf-text-muted)]">{circle.created}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[var(--sf-text-secondary)]">Members: {circle.members}</span>
                        <span className="text-[var(--sf-text-muted)]">•</span>
                        <span className="text-[var(--sf-text-secondary)]">Active: {circle.active}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                      onClick={() => {
                        alert(`${userToAssign.name} has been assigned to ${circle.name}`);
                        setShowAssignCircleModal(false);
                      }}
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--sf-border)]">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowAssignCircleModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
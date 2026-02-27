import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { Search, Download, AlertCircle, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  status: number;
  xp: number;
  streak: number;
  pauseTokens: number;
  circleAssigned: boolean;
  joinedDate: string;
  lastActive: string;
  sequentialUnlock: boolean;
  needsCircleAssignment: boolean; // Red flag for users at threshold without circle
}

interface UserManagementProps {
  onViewUser: (userId: number) => void;
}

export function UserManagement({ onViewUser }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@email.com', 
      status: 2, 
      xp: 1450, 
      streak: 28, 
      pauseTokens: 2,
      circleAssigned: true,
      joinedDate: 'Jan 5, 2026',
      lastActive: '2 hours ago',
      sequentialUnlock: false,
      needsCircleAssignment: false
    },
    { 
      id: 2, 
      name: 'Mike Chen', 
      email: 'mike.c@email.com', 
      status: 1, 
      xp: 750, 
      streak: 12, 
      pauseTokens: 3,
      circleAssigned: true,
      joinedDate: 'Jan 20, 2026',
      lastActive: '5 hours ago',
      sequentialUnlock: false,
      needsCircleAssignment: false
    },
    { 
      id: 3, 
      name: 'Emma Davis', 
      email: 'emma.d@email.com', 
      status: 3, 
      xp: 2850, 
      streak: 45, 
      pauseTokens: 5,
      circleAssigned: false,
      joinedDate: 'Dec 15, 2025',
      lastActive: '1 hour ago',
      sequentialUnlock: false,
      needsCircleAssignment: true // Red flag - needs circle assignment
    },
    { 
      id: 4, 
      name: 'Alex Thompson', 
      email: 'alex.t@email.com', 
      status: 1, 
      xp: 450, 
      streak: 7, 
      pauseTokens: 3,
      circleAssigned: false,
      joinedDate: 'Feb 1, 2026',
      lastActive: '30 minutes ago',
      sequentialUnlock: true, // Sequential unlock enabled (reviewer/admin)
      needsCircleAssignment: false
    },
    { 
      id: 5, 
      name: 'Lisa Park', 
      email: 'lisa.p@email.com', 
      status: 2, 
      xp: 1200, 
      streak: 21, 
      pauseTokens: 1,
      circleAssigned: true,
      joinedDate: 'Jan 12, 2026',
      lastActive: 'Yesterday',
      sequentialUnlock: false,
      needsCircleAssignment: false
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-blue-100 text-blue-700';
      case 2: return 'bg-green-100 text-green-700';
      case 3: return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate and download a CSV
    console.log('Exporting user data...');
  };

  return (
    <div>
      <PageHeader 
        title="User management"
        subtitle="View and manage all users, statuses, and permissions"
        actions={
          <Button 
            variant="outline"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data (CSV)
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--sf-text-secondary)]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-secondary)]"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] text-[var(--sf-text-secondary)]"
            >
              <option value="all">All Status Levels</option>
              <option value="1">Status 1</option>
              <option value="2">Status 2</option>
              <option value="3">Status 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--sf-text-secondary)]">Total Users</p>
              <p 
                className="text-3xl mt-1"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {users.length}
              </p>
            </div>
            <UsersIcon className="w-8 h-8 text-[var(--sf-orange)]" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--sf-text-secondary)]">Active Today</p>
              <p 
                className="text-3xl mt-1"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {users.filter(u => u.lastActive.includes('hour') || u.lastActive.includes('minute')).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--sf-text-secondary)]">Sequential Mode</p>
              <p 
                className="text-3xl mt-1"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {users.filter(u => u.sequentialUnlock).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--sf-text-secondary)]">Needs Circle</p>
              <p 
                className="text-3xl mt-1 text-red-600"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {users.filter(u => u.needsCircleAssignment).length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* User Table */}
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
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  XP / Streak
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Pause tokens
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Circle
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Last active
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs tracking-wider text-[var(--sf-text-secondary)]"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Flags
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
              {filteredUsers.map(user => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    user.needsCircleAssignment ? 'bg-red-50' : ''
                  }`}
                  onDoubleClick={() => onViewUser(user.id)}
                  title="Double-click to view user details"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-[var(--sf-text-primary)] font-medium">{user.name}</p>
                      <p className="text-sm text-[var(--sf-text-secondary)]">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                      Status {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium">{user.xp.toLocaleString()} XP</p>
                      <p className="text-sm text-[var(--sf-text-secondary)]">{user.streak} day streak</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium">{user.pauseTokens}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.circleAssigned ? (
                      <span className="text-sm text-green-600">Assigned</span>
                    ) : (
                      <span className="text-sm text-[var(--sf-text-muted)]">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--sf-text-secondary)]">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {user.sequentialUnlock && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          Sequential
                        </span>
                      )}
                      {user.needsCircleAssignment && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Circle
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => onViewUser(user.id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-[var(--sf-text-muted)]">
            <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No users found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
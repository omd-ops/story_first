import { Users, MessageSquare, UserPlus, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { MetricCard } from '../shared/MetricCard';
import { StatusBadge } from '../shared/StatusBadge';

export function Dashboard() {
  const recentActivity = [
    { id: 1, user: 'Sarah Johnson', action: 'Completed Day 12', time: '5 minutes ago', type: 'success' },
    { id: 2, user: 'Mike Chen', action: 'Submitted feedback for Day 8', time: '12 minutes ago', type: 'pending' },
    { id: 3, user: 'Emma Davis', action: 'Joined waitlist', time: '23 minutes ago', type: 'info' },
    { id: 4, user: 'Alex Thompson', action: 'Reached 30-day streak', time: '1 hour ago', type: 'success' },
    { id: 5, user: 'Lisa Park', action: 'Used pause token', time: '2 hours ago', type: 'warning' },
  ];

  const alerts = [
    { id: 1, message: '47 feedback items pending review', severity: 'warning' },
    { id: 2, message: '12 users in signup queue ready to activate', severity: 'info' },
    { id: 3, message: 'Day 35 content missing video upload', severity: 'error' },
  ];

  return (
    <div>
      <PageHeader 
        title="Dashboard"
        subtitle="Operations overview and recent activity"
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Feedback"
          value="124"
          icon={CheckCircle}
          trend={{ value: '15%', isPositive: true }}
          color="green"
        />
        <MetricCard
          title="Grading"
          value="47"
          icon={MessageSquare}
          trend={{ value: '8%', isPositive: false }}
          color="yellow"
        />
        <MetricCard
          title="Signup Queue"
          value="156"
          icon={UserPlus}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <h2 
            className="text-2xl tracking-wide mb-4 text-[var(--sf-text-primary)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start justify-between py-3 border-b border-[var(--sf-border)] last:border-0">
                <div className="flex-1">
                  <p className="text-[var(--sf-text-primary)] font-medium">{activity.user}</p>
                  <p className="text-sm text-[var(--sf-text-secondary)]">{activity.action}</p>
                </div>
                <span className="text-xs text-[var(--sf-text-muted)] whitespace-nowrap ml-4">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <h2 
            className="text-2xl tracking-wide mb-4 text-[var(--sf-text-primary)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Alerts & Notifications
          </h2>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  alert.severity === 'error' ? 'bg-[#FFEBEE]' :
                  alert.severity === 'warning' ? 'bg-[#FFF4E6]' :
                  'bg-[#E3F2FD]'
                }`}
              >
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                  alert.severity === 'error' ? 'text-[var(--sf-red)]' :
                  alert.severity === 'warning' ? 'text-[var(--sf-orange)]' :
                  'text-[var(--sf-blue)]'
                }`} />
                <p className="text-sm text-[var(--sf-text-primary)]">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
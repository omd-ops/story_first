import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'orange' | 'yellow' | 'blue' | 'green' | 'red';
}

export function MetricCard({ title, value, icon: Icon, trend, color = 'orange' }: MetricCardProps) {
  const colorClasses = {
    orange: 'bg-[#FFF4E6] text-[var(--sf-orange)]',
    yellow: 'bg-[#FFFBE6] text-[#FFD93D]',
    blue: 'bg-[#E3F2FD] text-[var(--sf-blue)]',
    green: 'bg-[#E8F5E9] text-[var(--sf-green)]',
    red: 'bg-[#FFEBEE] text-[var(--sf-red)]',
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-sm ${trend.isPositive ? 'text-[var(--sf-green)]' : 'text-[var(--sf-red)]'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      
      <h3 className="text-[var(--sf-text-muted)] text-sm mb-1">{title}</h3>
      <p 
        className="text-3xl text-[var(--sf-text-primary)]"
        style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.02em' }}
      >
        {value}
      </p>
    </div>
  );
}

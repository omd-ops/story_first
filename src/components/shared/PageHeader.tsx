import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 
          className="text-4xl tracking-wide text-[var(--sf-text-primary)] mb-2"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[var(--sf-text-secondary)] text-[15px]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}

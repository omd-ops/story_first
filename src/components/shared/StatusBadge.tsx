interface StatusBadgeProps {
  status: 'draft' | 'ready' | 'published' | 'active' | 'pending' | 'approved' | 'rejected' | 'paused' | 'in-progress';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    draft: { bg: 'bg-[#E8E9EB]', text: 'text-[var(--sf-text-primary)]', border: 'border-[#B8BABF]' },
    ready: { bg: 'bg-[#FFE5D9]', text: 'text-[var(--sf-text-primary)]', border: 'border-[#FF8856]' },
    published: { bg: 'bg-[#D4F4DD]', text: 'text-[var(--sf-text-primary)]', border: 'border-[#6BCF7F]' },
    active: { bg: 'bg-[#FFFBE6]', text: 'text-[#FFD93D]', border: 'border-[#FFD93D]/30' },
    pending: { bg: 'bg-[#FFF4E6]', text: 'text-[#FF8856]', border: 'border-[#FF8856]/30' },
    approved: { bg: 'bg-[#E8F5E9]', text: 'text-[#6BCF7F]', border: 'border-[#6BCF7F]/30' },
    rejected: { bg: 'bg-[#FFEBEE]', text: 'text-[#E74C3C]', border: 'border-[#E74C3C]/30' },
    paused: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
    'in-progress': { bg: 'bg-[#E3F2FD]', text: 'text-[#4A90E2]', border: 'border-[#4A90E2]/30' },
  };

  const style = styles[status] || styles.draft;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs tracking-wide ${style.bg} ${style.text} ${style.border} ${className}`}
      style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
    >
      {status}
    </span>
  );
}
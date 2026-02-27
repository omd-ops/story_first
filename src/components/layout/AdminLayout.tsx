import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function AdminLayout({ children, currentScreen, onNavigate }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--sf-warm-bg)]" style={{ fontFamily: 'var(--font-helvetica)' }}>
      <AdminSidebar currentScreen={currentScreen} onNavigate={onNavigate} />
      <AdminHeader onNavigate={onNavigate} />
      
      <main className="ml-64 mt-16 p-8 max-w-[1400px]">
        {children}
      </main>
    </div>
  );
}
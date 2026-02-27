import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  UsersRound, 
  PartyPopper, 
  Settings, 
  ChevronDown,
  FileText,
  UserPlus,
  Sparkles,
  Bug,
  Wand2
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ElementType;
  children?: { id: string; label: string }[];
}

const navSections: NavSection[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'content',
    label: 'Content',
    icon: BookOpen,
    children: [
      { id: 'content-dashboard', label: 'Content Dashboard' },
      { id: 'feed-content', label: 'Feed Content' },
    ],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    children: [
      { id: 'user-management', label: 'All Users' },
      { id: 'signup-queue', label: 'Signup Queue' },
    ],
  },
  { id: 'prompt-management', label: 'Prompt Management', icon: Wand2 },
  { id: 'feedback-queue', label: 'Grading', icon: MessageSquare },
  { id: 'user-feedback', label: 'User Feedback', icon: Bug },
  {
    id: 'circles',
    label: 'Circles',
    icon: UsersRound,
    children: [
      { id: 'circle-management', label: 'Circle Management' },
      { id: 'circle-communication', label: 'Bulk Communication' },
      { id: 'circle-requests', label: 'Circle Requests' },
    ],
  },
  { id: 'celebrations', label: 'Celebrations', icon: PartyPopper },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ currentScreen, onNavigate }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['content', 'users', 'circles']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <aside 
      className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[var(--sf-border)] flex flex-col"
      style={{ fontFamily: 'var(--font-helvetica)' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-[var(--sf-border)] px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[var(--sf-orange)]" />
          <span 
            className="text-xl tracking-wider text-[var(--sf-near-black)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            StoryFirst Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-1">
          {navSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.includes(section.id);
            const isActive = currentScreen === section.id || 
                           section.children?.some(child => child.id === currentScreen);

            return (
              <li key={section.id}>
                <button
                  onClick={() => {
                    if (section.children) {
                      toggleSection(section.id);
                    } else {
                      onNavigate(section.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors ${
                    isActive && !section.children
                      ? 'bg-[var(--sf-orange)] text-white'
                      : 'text-[var(--sf-text-primary)] hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-[15px]">{section.label}</span>
                  </div>
                  {section.children && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Sub-navigation */}
                {section.children && isExpanded && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {section.children.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => onNavigate(child.id)}
                          className={`w-full text-left px-3 py-2 text-[14px] transition-colors ${
                            currentScreen === child.id
                              ? 'bg-[var(--sf-orange)] text-white'
                              : 'text-[var(--sf-text-secondary)] hover:bg-gray-100 hover:text-[var(--sf-text-primary)]'
                          }`}
                        >
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
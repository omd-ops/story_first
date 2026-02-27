export interface ProfileProps {
  onClose: () => void;
}

export type ProfileSectionKey = 'profile' | 'settings' | 'feedback';

export interface FeedbackCardProps {
  week: number;
  isExpanded: boolean;
  onToggle: () => void;
  summary: string;
  details: any;
}

export type OnboardingStep =
  | "phone"
  | "verify"
  | "profile"
  | "waitlist"
  | "goals"
  | "journey"
  | "invite"
  | "solo-confirm"
  | "schedule"
  | "lesson"
  | "orientation";

export interface OnboardingFormData {
  countryCode: string;
  phoneNumber: string;
  otp: string;
  fullName: string;
  email: string;
  displayName: string;
  selectedGoals: string[];
  goalDetails: { [key: string]: string };
  journeyMode: "friends" | "solo" | null;
  invites: { type: "phone" | "email"; value: string }[];
  scheduleDays: string[];
  scheduleTime: { hour: number; minute: number; period: string };
  timezone: string;
}

export type SetFormData = React.Dispatch<
  React.SetStateAction<OnboardingFormData>
>;
export type SetStep = React.Dispatch<React.SetStateAction<OnboardingStep>>;

export type TimeField = "hour" | "minute" | "period";

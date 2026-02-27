import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FeedbackButton } from "./FeedbackButton";
import {
  daysOfWeek,
  goalDescriptions,
  goalOptions,
} from "./onboarding/constants";
import { handleDayToggle } from "./onboarding/actions/handleDayToggle";
import { handleGoalToggle } from "./onboarding/actions/handleGoalToggle";
import { handleJourneySelect } from "./onboarding/actions/handleJourneySelect";
import { handleProfileSubmit } from "./onboarding/actions/handleProfileSubmit";
import { handleResendCode } from "./onboarding/actions/handleResendCode";
import { handleSendCode } from "./onboarding/actions/handleSendCode";
import { handleTimeChange } from "./onboarding/actions/handleTimeChange";
import { handleVerifyOTP } from "./onboarding/actions/handleVerifyOTP";
import { getMaskedPhone } from "./onboarding/utils/getMaskedPhone";
import { getStepNumber } from "./onboarding/utils/getStepNumber";
import { OnboardingFormData, OnboardingStep } from "./onboarding/types";
import { scheduleReminder } from "@/lib/reminders";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("phone");
  const [formData, setFormData] = useState<OnboardingFormData>({
    countryCode: "+1",
    phoneNumber: "",
    otp: "",
    fullName: "",
    email: "",
    displayName: "",
    selectedGoals: [],
    goalDetails: {},
    journeyMode: null,
    invites: [],
    scheduleDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    scheduleTime: { hour: 8, minute: 0, period: "AM" },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showContactConfirmation, setShowContactConfirmation] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState<{
    type: "idle" | "pending" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [scheduleProviderErrors, setScheduleProviderErrors] = useState<
    string[]
  >([]);
  const [isSchedulingReminder, setIsSchedulingReminder] = useState(false);

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);
  const periodScrollRef = useRef<HTMLDivElement>(null);

  // OTP Timer
  useEffect(() => {
    if (currentStep === "verify" && !canResend) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, canResend]);

  // Auto-dismiss contact confirmation after 3 seconds
  useEffect(() => {
    if (showContactConfirmation) {
      const timer = setTimeout(() => {
        setShowContactConfirmation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showContactConfirmation]);

  const maskedPhone = getMaskedPhone(formData);
  const phoneForReminder = `${formData.countryCode}${formData.phoneNumber}`;

  const handleScheduleSave = async () => {
    if (formData.scheduleDays.length === 0) {
      setScheduleStatus({
        type: "error",
        message: "Pick at least one day for reminders.",
      });
      return;
    }
    if (!formData.phoneNumber) {
      setScheduleStatus({
        type: "error",
        message: "We need a verified phone to send reminders.",
      });
      return;
    }

    setScheduleStatus({ type: "pending", message: "Scheduling reminders…" });
    setScheduleProviderErrors([]);
    setIsSchedulingReminder(true);

    try {
      const response = await scheduleReminder({
        phone: phoneForReminder,
        scheduleDays: formData.scheduleDays,
        scheduleTime: formData.scheduleTime,
        timezone: formData.timezone,
      });

      const hasTwilioFailure = response.twilioSuccess === false;
      setScheduleStatus({
        type: response.success && !hasTwilioFailure ? "success" : "error",
        message: response.message,
      });
      setScheduleProviderErrors(response.providerErrors ?? []);

      if (response.success && response.twilioSuccess !== false) {
        // Send welcome SMS with magic link
        try {
          const smsRes = await fetch("/api/reminders/send-welcome-sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phoneForReminder }),
          });
          if (!smsRes.ok) {
            console.warn("Welcome SMS failed:", await smsRes.text());
          }
        } catch (smsErr) {
          console.error("Welcome SMS error:", smsErr);
        }
        onComplete();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to schedule reminders";
      setScheduleStatus({ type: "error", message });
      setScheduleProviderErrors([]);
    } finally {
      setIsSchedulingReminder(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Indicator - Minimal */}
      <div className="px-5 pt-8 pb-6">
        <div className="w-full max-w-xs mx-auto bg-[var(--background-elevated)] rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-[var(--accent-orange)]"
            initial={{ width: "0%" }}
            animate={{ width: `${(getStepNumber(currentStep) / 6) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-6 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* SCREEN 1: Phone Number */}
          {currentStep === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto pt-12"
            >
              <h1
                className="text-5xl mb-4 text-black tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Let&apos;s get you
                <span className="lg:hidden">
                  <br />
                </span>
                <span className="hidden lg:inline"> </span>started
              </h1>
              <p className="text-[var(--secondary-text)] mb-12 text-base">
                We&apos;ll send you a one-time code to verify your number.
              </p>

              <div className="mb-12">
                <div className="flex gap-3">
                  {/* Country Code Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowCountryPicker(!showCountryPicker)}
                      className="bg-white border-b-2 border-[var(--border-medium)] px-3 py-4 text-black flex items-center gap-2 hover:border-[var(--accent-orange)] transition-colors"
                    >
                      <span className="text-lg">{formData.countryCode}</span>
                      <ChevronDown className="w-4 h-4 text-[var(--secondary-text)]" />
                    </button>
                    {showCountryPicker && (
                      <div className="absolute top-full mt-2 bg-white rounded overflow-hidden shadow-xl border border-[var(--border)] z-10 w-24">
                        {["+1", "+44", "+91"].map((code) => (
                          <button
                            key={code}
                            onClick={() => {
                              setFormData({ ...formData, countryCode: code });
                              setShowCountryPicker(false);
                            }}
                            className="w-full px-4 py-3 text-left text-black hover:bg-[var(--background-elevated)] transition-colors"
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phoneNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="Phone number"
                    className="flex-1 bg-white border-b-2 border-[var(--border-medium)] px-0 py-4 text-black text-lg placeholder:text-[var(--secondary-text)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                    maxLength={10}
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  handleSendCode(
                    formData,
                    setCurrentStep,
                    setCanResend,
                    setResendTimer,
                  )
                }
                disabled={formData.phoneNumber.length < 10}
                className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-4 rounded-full font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed mb-6 shadow-md"
              >
                Send Code
              </button>

              <p className="text-xs text-[var(--secondary-text)] text-center leading-relaxed">
                We only use your number for important
                <br />
                updates and reminders.
              </p>
            </motion.div>
          )}

          {/* SCREEN 1.5: OTP Verification */}
          {currentStep === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto pt-12"
            >
              <h1
                className="text-5xl mb-4 text-black tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Enter the 6-Digit Code
              </h1>
              <p className="text-[var(--secondary-text)] mb-12">
                Sent to {maskedPhone}
              </p>

              <div className="mb-12">
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                    })
                  }
                  placeholder="000000"
                  className="w-full bg-white border-b-2 border-[var(--border-medium)] px-0 py-4 text-black text-center text-3xl tracking-[0.5em] placeholder:text-[var(--tertiary-text)] placeholder:tracking-[0.3em] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <button
                onClick={() =>
                  handleVerifyOTP(formData, setCurrentStep, onComplete)
                }
                disabled={formData.otp.length !== 6}
                className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-4 rounded-full font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed mb-6 shadow-md"
              >
                Verify
              </button>

              <div className="text-center">
                {canResend ? (
                  <button
                    onClick={() =>
                      handleResendCode(
                        formData,
                        setCanResend,
                        setResendTimer,
                        setFormData,
                      )
                    }
                    className="text-[var(--accent-orange)] text-sm font-semibold hover:text-[var(--accent-orange-dark)] transition-colors"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="text-sm text-[var(--secondary-text)]">
                    Resend code in {resendTimer}s
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: Profile Setup */}
          {currentStep === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto pt-12"
            >
              <h1
                className="text-5xl mb-4 text-black tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Tell Us a Little About You
              </h1>
              <p className="text-[var(--secondary-text)] mb-12">
                This helps us personalize your journey.
              </p>

              <div className="space-y-8 mb-12">
                <div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Full Name"
                    className="w-full bg-white border-b-2 border-[var(--border-medium)] px-0 py-4 text-black text-lg placeholder:text-[var(--secondary-text)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Email Address (Optional)"
                    className="w-full bg-white border-b-2 border-[var(--border-medium)] px-0 py-4 text-black text-lg placeholder:text-[var(--secondary-text)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    placeholder="Display Name (Optional)"
                    className="w-full bg-white border-b-2 border-[var(--border-medium)] px-0 py-4 text-black text-lg placeholder:text-[var(--secondary-text)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                  />
                  <p className="text-xs text-[var(--secondary-text)] mt-3 leading-relaxed">
                    How others will see you in circles
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleProfileSubmit(formData, setCurrentStep)}
                disabled={!formData.fullName}
                className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-4 rounded-full font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* SCREEN 3: Waitlist Confirmation */}
          {currentStep === "waitlist" && (
            <motion.div
              key="waitlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto pt-12 text-center"
            >
              {/* Celebration Visual */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
                className="w-20 h-20 mx-auto mb-12 bg-[var(--accent-orange)] rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
              </motion.div>

              <h1
                className="text-5xl mb-6 text-black tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Thanks for
                <br />
                Joining the
                <br />
                Waitlist!
              </h1>
              <p className="text-black text-lg mb-3 leading-relaxed font-medium">
                We&apos;re excited to have you here.
              </p>
              <p className="text-[var(--secondary-text)] mb-12 leading-relaxed">
                Meanwhile, let&apos;s personalize your journey.
              </p>

              <button
                onClick={() => setCurrentStep("goals")}
                className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-4 rounded-full font-semibold transition-all shadow-md"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* SCREEN 4: Storytelling Goals */}
          {currentStep === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto pt-12"
            >
              <h1
                className="text-4xl mb-4 text-black tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                What Do You Want to Work On?
              </h1>
              <p className="text-[var(--secondary-text)] mb-2">
                Select all that apply
              </p>

              <p className="text-xs text-[var(--accent-orange)] mb-10 leading-relaxed font-semibold">
                This helps us match you with like-minded people
              </p>

              <div className="space-y-3">
                {goalOptions.map((goal) => {
                  const isSelected = formData.selectedGoals.includes(goal);
                  return (
                    <div key={goal}>
                      <button
                        onClick={() => handleGoalToggle(goal, setFormData)}
                        className={`w-full text-left px-0 py-4 border-b-2 transition-all ${
                          isSelected
                            ? "border-[var(--accent-orange)] text-black"
                            : "border-[var(--border-medium)] text-[var(--secondary-text)] hover:text-black hover:border-[var(--border)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium">{goal}</span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[var(--accent-orange)] flex items-center justify-center flex-shrink-0">
                              <Check
                                className="w-3 h-3 text-white"
                                strokeWidth={3}
                              />
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Expanded detail input */}
                      <AnimatePresence>
                        {isSelected && goalDescriptions[goal] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm text-[var(--secondary-text)] mt-3 mb-2 leading-relaxed">
                              {goalDescriptions[goal]}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SCREEN 5: Journey Mode Selection */}
          {currentStep === "journey" && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto pt-12"
            >
              <h1
                className="text-4xl mb-4 text-black tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Do You Have People You Want to Join With?
              </h1>
              <p className="text-[var(--secondary-text)] mb-12 leading-relaxed">
                Some journeys are powerful alone.
                <br />
                Some are better together.
              </p>

              <div className="space-y-4 mb-8">
                <button
                  onClick={() =>
                    handleJourneySelect(
                      "friends",
                      formData,
                      setFormData,
                      setCurrentStep,
                    )
                  }
                  className="w-full bg-white border-2 border-[var(--border)] hover:border-[var(--accent-orange)] rounded p-8 text-left transition-all group shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">👥</div>
                    <div className="flex-1">
                      <h3 className="text-black text-xl font-semibold mb-2">
                        Yes, with friends
                      </h3>
                      <p className="text-sm text-[var(--secondary-text)] leading-relaxed">
                        Create a private circle
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() =>
                    handleJourneySelect(
                      "solo",
                      formData,
                      setFormData,
                      setCurrentStep,
                    )
                  }
                  className="w-full bg-white border-2 border-[var(--border)] hover:border-[var(--accent-orange)] rounded p-8 text-left transition-all group shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🌟</div>
                    <div className="flex-1">
                      <h3 className="text-black text-xl font-semibold mb-2">
                        No, I&apos;ll start solo
                      </h3>
                      <p className="text-sm text-[var(--secondary-text)] leading-relaxed">
                        Be matched with a goal-based circle
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 5a: Invite Friends */}
          {currentStep === "invite" && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto pt-12 text-center"
            >
              <p className="text-[var(--secondary-text)] mb-8 leading-relaxed text-base">
                Stories are better together.
                <br />
                Ready to build your circle?
              </p>

              <h1
                className="text-6xl mb-6 text-black leading-none"
                style={{
                  fontFamily: "var(--font-bebas)",
                  letterSpacing: "0.01em",
                }}
              >
                Add Your
                <br />
                Friends
              </h1>

              <p className="text-[var(--secondary-text)] mb-16 leading-relaxed text-base max-w-sm mx-auto">
                Contact our team and we&apos;ll help you invite friends to join
                your private storytelling circle.
              </p>

              <button
                onClick={() => setShowContactConfirmation(true)}
                className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-4 rounded-full font-semibold transition-all shadow-md"
              >
                Contact Admin
              </button>
            </motion.div>
          )}

          {/* SCREEN 5b: Solo Confirmation */}
          {currentStep === "solo-confirm" && (
            <motion.div
              key="solo-confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto pt-12 text-center"
            >
              <div className="text-6xl mb-12">🌟</div>

              <h1
                className="text-5xl mb-6 text-black tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Starting Solo is
                <br />
                Powerful Too
              </h1>
              <p className="text-[var(--secondary-text)] mb-12 text-lg leading-relaxed">
                We&apos;ll match you with a circle aligned
                <br />
                to your goals when the time is right.
              </p>

              <button
                onClick={() => setCurrentStep("schedule")}
                className="w-full bg-[var(--accent-orange)] hover:bg-[#E67A2E] text-white py-4 rounded-full font-medium transition-all"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* SCREEN 6: Schedule Setup */}
          {currentStep === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto pt-12"
            >
              <h1
                className="text-5xl mb-4 text-black tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                When Should We Nudge You?
              </h1>
              <p className="text-[var(--secondary-text)] mb-12 leading-relaxed">
                Choose when you&apos;d like to receive
                <br />
                reflection prompts and updates.
              </p>

              {/* Days of Week */}
              <div className="mb-10">
                <label className="block text-black text-sm font-semibold mb-4">
                  Days of the week
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => {
                    const isSelected = formData.scheduleDays.includes(day.full);
                    return (
                      <button
                        key={day.full}
                        onClick={() => handleDayToggle(day.full, setFormData)}
                        className={`aspect-square rounded-full font-semibold text-sm transition-all ${
                          isSelected
                            ? "bg-[var(--accent-orange)] text-white shadow-md"
                            : "bg-white border-2 border-[var(--border)] text-[var(--secondary-text)] hover:border-[var(--accent-orange)]/50"
                        }`}
                      >
                        {day.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Picker */}
              <div className="mb-10">
                <label className="block text-black text-sm mb-4">
                  Reminder Time
                </label>

                {/* Time Display Button */}
                <button
                  onClick={() => setShowTimePicker(!showTimePicker)}
                  className="w-full px-4 py-3 bg-white border-2 border-[var(--border)] text-black rounded focus:outline-none hover:border-[var(--accent-orange)] transition-colors text-left shadow-sm"
                >
                  {formData.scheduleTime.hour}:
                  {formData.scheduleTime.minute.toString().padStart(2, "0")}{" "}
                  {formData.scheduleTime.period}
                </button>

                {/* Refined Time Picker Modal */}
                {showTimePicker && (
                  <div className="mt-4 bg-white rounded-3xl p-6 border-2 border-[var(--border)] shadow-2xl">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-black font-medium text-base tracking-tight">
                        Choose reminder time
                      </h3>
                      <button
                        onClick={() => setShowTimePicker(false)}
                        className="text-[var(--accent-orange)] text-base font-medium hover:text-[#FF9D5C] transition-colors"
                      >
                        Done
                      </button>
                    </div>

                    {/* Time Picker Wheel */}
                    <div className="relative h-52 bg-[var(--background-elevated)] rounded-2xl overflow-hidden shadow-inner">
                      {/* Selection Bar - Warm Orange/Yellow with Soft Glow */}
                      <div className="absolute top-1/2 left-0 right-0 h-11 -translate-y-1/2 pointer-events-none z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF8B3D] via-[#FFD166] to-[#FF8B3D] rounded-xl opacity-90"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF8B3D] via-[#FFD166] to-[#FF8B3D] rounded-xl blur-md opacity-40"></div>
                      </div>

                      {/* Gradient Overlays for soft fade */}
                      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[var(--background-elevated)] via-[var(--background-elevated)]/80 to-transparent pointer-events-none z-20"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--background-elevated)] via-[var(--background-elevated)]/80 to-transparent pointer-events-none z-20"></div>

                      <div className="flex h-full">
                        {/* Hour Picker */}
                        <div
                          className="flex-1 relative overflow-y-auto scrollbar-hide py-20 scroll-smooth"
                          ref={hourScrollRef}
                        >
                          <div className="flex flex-col items-center">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (h) => (
                                <button
                                  key={h}
                                  onClick={() =>
                                    handleTimeChange("hour", h, setFormData)
                                  }
                                  className={`py-2.5 px-4 transition-all duration-300 ease-out relative z-30 ${
                                    formData.scheduleTime.hour === h
                                      ? "text-black text-2xl font-bold"
                                      : "text-[var(--secondary-text)] text-lg font-normal"
                                  }`}
                                >
                                  {h}
                                </button>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Minute Picker */}
                        <div
                          className="flex-1 relative overflow-y-auto scrollbar-hide py-20 scroll-smooth"
                          ref={minuteScrollRef}
                        >
                          <div className="flex flex-col items-center">
                            {Array.from({ length: 4 }, (_, i) => i * 15).map(
                              (m) => (
                                <button
                                  key={m}
                                  onClick={() =>
                                    handleTimeChange("minute", m, setFormData)
                                  }
                                  className={`py-2.5 px-4 transition-all duration-300 ease-out relative z-30 ${
                                    formData.scheduleTime.minute === m
                                      ? "text-black text-2xl font-bold"
                                      : "text-[var(--secondary-text)] text-lg font-normal"
                                  }`}
                                >
                                  {m.toString().padStart(2, "0")}
                                </button>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Period Picker (AM/PM) */}
                        <div
                          className="flex-1 relative overflow-y-auto scrollbar-hide py-20 scroll-smooth"
                          ref={periodScrollRef}
                        >
                          <div className="flex flex-col items-center">
                            {["AM", "PM"].map((p) => (
                              <button
                                key={p}
                                onClick={() =>
                                  handleTimeChange("period", p, setFormData)
                                }
                                className={`py-2.5 px-4 transition-all duration-300 ease-out relative z-30 ${
                                  formData.scheduleTime.period === p
                                    ? "text-black text-2xl font-bold"
                                    : "text-[var(--secondary-text)] text-lg font-normal"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timezone Selector */}
              <div className="mb-10">
                <label className="block text-black text-sm font-semibold mb-4">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border-2 border-[var(--border)] text-black focus:outline-none focus:border-[var(--accent-orange)] transition-colors shadow-sm"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/Anchorage">Alaska Time (AKT)</option>
                  <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">
                    Central European Time (CET)
                  </option>
                  <option value="Asia/Tokyo">Japan Time (JST)</option>
                  <option value="Australia/Sydney">
                    Australian Eastern Time (AET)
                  </option>
                </select>
              </div>

              <p className="text-xs text-[var(--secondary-text)] text-center mb-8 leading-relaxed">
                You can change this anytime later
              </p>

              <button
                onClick={handleScheduleSave}
                disabled={
                  formData.scheduleDays.length === 0 || isSchedulingReminder
                }
                className="w-full bg-[var(--accent-orange)] hover:bg-[#E67A2E] text-white py-4 rounded-full font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSchedulingReminder
                  ? "Scheduling reminders…"
                  : "Save Schedule"}
              </button>
              {scheduleStatus.type !== "idle" && (
                <p
                  className={`mt-3 text-sm ${
                    scheduleStatus.type === "error"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {scheduleStatus.message ??
                    (scheduleStatus.type === "error"
                      ? "Something went wrong."
                      : "Reminders are ready.")}
                </p>
              )}
              {scheduleProviderErrors.length > 0 && (
                <div className="mt-2 text-xs text-[var(--secondary-text)] space-y-1">
                  {scheduleProviderErrors.map((error, idx) => (
                    <p key={idx}>{error}</p>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky CTA - Only for goals screen */}
      {currentStep === "goals" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] px-6 py-4 z-50">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setCurrentStep("journey")}
              disabled={formData.selectedGoals.length === 0}
              className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-4 rounded-full font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Feedback Button */}
      <FeedbackButton />

      {/* Contact Confirmation Modal */}
      <AnimatePresence>
        {showContactConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded p-8 max-w-sm w-full shadow-2xl text-center"
            >
              {/* Orange Circle with Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  duration: 0.6,
                  bounce: 0.4,
                  delay: 0.1,
                }}
                className="w-20 h-20 mx-auto mb-8 bg-[var(--accent-orange)] rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
              </motion.div>

              {/* Message */}
              <p className="text-[var(--secondary-text)] text-base mb-4 leading-relaxed font-medium">
                Thanks for contacting!
              </p>
              <p className="text-[var(--secondary-text)] text-sm leading-relaxed">
                We&apos;ll get back to you soon.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { supabase } from "@/lib/supabase/client";
import { OnboardingFormData, SetStep } from "../types";

export async function handleSendCode(
  formData: OnboardingFormData,
  setCurrentStep: SetStep,
  setCanResend: React.Dispatch<React.SetStateAction<boolean>>,
  setResendTimer: React.Dispatch<React.SetStateAction<number>>,
) {
  const phonePattern = /^\+\d{10,15}$/;
  const phone = formData.countryCode + formData.phoneNumber;

  if (formData.phoneNumber.length >= 10 && phonePattern.test(phone)) {
    const { error } = await supabase.auth.signInWithOtp({ phone: phone });

    if (error) {
      console.error("Error sending OTP:", error);
      return;
    }

    setCurrentStep("verify");
    setCanResend(false);
    setResendTimer(30);
  }
}

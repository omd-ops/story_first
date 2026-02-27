import { supabase } from "@/lib/supabase/client";
import { OnboardingFormData, SetStep } from "../types";

export async function handleProfileSubmit(
  formData: OnboardingFormData,
  setCurrentStep: SetStep,
) {
  if (!formData.fullName) {
    setCurrentStep("profile");
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("users")
    .update({
      name: formData.fullName,
      display_name: formData.displayName,
      email: formData.email,
      status: "active",
    })
    .eq("id", user.id);

  if (!error) {
    setCurrentStep("waitlist");
  }
}

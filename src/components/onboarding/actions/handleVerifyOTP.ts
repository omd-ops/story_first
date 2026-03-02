import { supabase } from "@/lib/supabase/client";
import { OnboardingFormData, SetStep } from "../types";

// export async function handleVerifyOTP(
//   formData: OnboardingFormData,
//   setCurrentStep: SetStep,
//   onComplete: () => void,
// ) {
//   const { error } = await supabase.auth.verifyOtp({
//     phone: formData.countryCode + formData.phoneNumber,
//     token: formData.otp,
//     type: "sms",
//   });

//   if (error) {
//     console.error(error.message);
//     return;
//   }

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     setCurrentStep("profile");
//     return;
//   }

//   // const { data: profile } = await supabase
//   //   .from("users")
//   //   .select("status")
//   //   .eq("id", user!.id)
//   //   .single();

//   // if (!profile || profile.status === "pending") {
//   //   redirect("/onboarding");
//   // }
//   // move to the next phase by invoking the completion callback instead
//   onComplete();
//   // setSelectedLesson(1);
// }

export async function handleVerifyOTP(
  formData: OnboardingFormData,
  setCurrentStep: SetStep,
  onComplete: () => void,
) {
  // 1️⃣ Verify OTP (TEMPORARY BYPASS FOR TESTING)
  // const { error: otpError } = await supabase.auth.verifyOtp({
  //   phone: formData.countryCode + formData.phoneNumber,
  //   token: formData.otp,
  //   type: "sms",
  // });
  //
  // if (otpError) {
  //   console.error("OTP verification failed:", otpError.message);
  //   return;
  // }

  // 2️⃣ Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Failed to retrieve user:", userError?.message);
    return;
  }

  // Admins bypass onboarding and go directly to the admin dashboard.
  if (user.app_metadata?.role === "admin") {
    window.location.href = "/admin";
    return;
  }

  // 3️⃣ Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("status")
    .eq("id", user.id)
    .maybeSingle(); // safer than .single()

  if (profileError) {
    console.error("Profile lookup failed:", profileError.message);
    return;
  }

  // 4️⃣ If no profile OR still pending → go to profile step
  if (!profile || profile.status === "pending") {
    setCurrentStep("profile");
    return;
  }

  // 5️⃣ Otherwise onboarding is complete
  onComplete();
}

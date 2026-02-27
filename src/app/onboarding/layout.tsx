import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("users")
    .select("status")
    .eq("id", user.id)
    .single();

  if (profile?.status === "active") {
    redirect("/admin");
  }

  return <>{children}</>;
}

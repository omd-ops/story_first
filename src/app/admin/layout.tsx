import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Admin",
  description: `Content management and user administration interface`,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const supabase = await createSupabaseServer();

  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();

  //   if (!user) redirect("/");

  //   const { data: profile } = await supabase
  //     .from("users")
  //     .select("status")
  //     .eq("id", user.id)
  //     .single();

  //   if (!profile || profile.status === "pending") {
  //     redirect("/onboarding");
  //   }

  return (
    <div className="admin-layout">
      <section>{children}</section>
    </div>
  );
}

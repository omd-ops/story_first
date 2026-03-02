import type { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createSupabaseServer } from "@/lib/supabase/server";
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
  // TEMPORARY: auth/role guard disabled so /admin can be opened directly.
  // const supabase = await createSupabaseServer();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  //
  // if (!user) {
  //   redirect("/");
  // }
  //
  // if (user.app_metadata?.role !== "admin") {
  //   redirect("/");
  // }

  return (
    <div className="admin-layout">
      <section>{children}</section>
    </div>
  );
}

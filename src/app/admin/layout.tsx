import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import "@/styles/index.css";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createSupabaseServer();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/auth/phone");

    const { data: profile } = await supabase
        .from("users")
        .select("status")
        .eq("id", user.id)
        .single();

    if (!profile || profile.status === "pending") {
        redirect("/onboarding");
    }

    return <>{children}</>;
}
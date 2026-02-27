import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import "./globals.css";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Story First ",
  description: `Storytelling is treated as innate rather than learnable; no rigorous programs teach it as daily practice. Sonny Caberwal developed a curriculum for daily micro-learning, inspired by Duolingo, Wordle, Strava.
  Adults who want to improve their storytelling skills need a way to practice consistently because storytelling is treated as an innate talent rather than a learnable skill. Currently, there are no rigorous programs that train storytelling systematically.`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const supabase = await createSupabaseServer();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user)
  //   // redirect("/");
  //   return (
  //     <html>
  //       <body>{children}</body>
  //     </html>
  //   );

  // const { data: profile } = await supabase
  //   .from("users")
  //   .select("status")
  //   .eq("id", user.id)
  //   .single();

  // if (profile?.status === "active") {
  //   redirect("/admin");
  // }

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

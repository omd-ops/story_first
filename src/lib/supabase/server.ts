// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServer() {
  const cookieStore = await cookies();
  // Directly use Next.js cookies API (safe in server components)
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supabase expects a get method that returns the cookie value string.
        get: (name) => cookieStore.get(name)?.value,
        // Uncomment if you need to set/delete cookies from the server.
        // set: (name, value, options) => cookies().set(name, value, options),
        // delete: (name, options) => cookies().delete(name, options),
      },
    }
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (signInError) throw signInError;
      // Successful login, redirect to dashboard or protected page
      // router.push("/dashboard");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-white p-8 rounded-xl w-87.5">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border w-full p-2 mb-3 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border w-full p-2 mb-4 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            className="w-full bg-pink-500 text-white p-2 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-3">{error}</p>
          )}

          <p className="text-center text-sm text-gray-600 py-2 mt-2">
            New here? <a href="/auth/signup" className="text-indigo-600 hover:underline">Create an account</a>
          </p>
        </form>
      </div>
    </div>
  );
}
"use client"

// src/app/auth/login/page.tsx
import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
            <h1 className="mb-6 text-4xl font-extrabold text-gray-800">Welcome Back</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl bg-white bg-opacity-80 p-6 shadow-lg backdrop-blur-md">
                {error && <p className="rounded bg-red-100 p-2 text-red-700">{error}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                    value={form.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className="w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                    value={form.password}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? "Signing in…" : "Log In"}
                </button>
                <p className="text-center text-sm text-gray-600">
                    New here? <a href="/auth/signup" className="text-indigo-600 hover:underline">Create an account</a>
                </p>
            </form>
        </main>
    );
}

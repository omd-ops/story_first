"use client"

// src/app/auth/signup/page.tsx
import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
        phone: "",
        name: "",
        referral_source: "",
        signup_goal: "",
    });
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
            const { error } = await supabase.auth.signInWithOtp({
                phone: form.phone,
                options: {
                    data: {
                        name: form.name,
                        referral_source: form.referral_source,
                        signup_goal: form.signup_goal,
                    },
                },
            });

            if (error) throw error;

            router.push(`/auth/verify?phone=${encodeURIComponent(form.phone)}`);
        } catch (err: any) {
            setError(err.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        name: form.name,
                        phone: form.phone,
                        referral_source: form.referral_source,
                        signup_goal: form.signup_goal,
                    },
                },
            });

            if (signUpError)
                throw signUpError;

            // After successful sign‑up Supabase creates auth.users and the DB trigger creates public.users.
            // Redirect to onboarding (or a welcome page).
            // router.push("/onboarding");
            router.push("/admin");
        } catch (err: any) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
            <h1 className="mb-6 text-4xl font-extrabold text-gray-800">Create Your Account</h1>
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
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (required)"
                    required
                    className="w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                    value={form.phone}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    className="w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                    value={form.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="referral_source"
                    placeholder="How did you hear about us?"
                    className="w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                    value={form.referral_source}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="signup_goal"
                    placeholder="What are you hoping to achieve?"
                    className="w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                    value={form.signup_goal}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? "Signing up…" : "Sign Up"}
                </button>
                <p className="text-center text-sm text-gray-600">
                    {/* Already have an account? <a href="/auth/login" className="text-indigo-600 hover:underline">Log in</a> */}
                    Already have an account? <link href="/" className="text-indigo-600 hover:underline">Log in</link>
                </p>
            </form>
        </main>
    );
}

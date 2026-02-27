"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PhonePage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simple validation for E.164 format (e.g., +1234567890)
        const phonePattern = /^\+\d{10,15}$/;
        if (!phonePattern.test(phone)) {
            setError('Please enter a valid phone number in international format, e.g., +14155552671');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithOtp({
            phone: phone,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`);
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSendOtp} className="space-y-4">
                <h1 className="text-2xl font-bold">Enter your phone</h1>

                <input
                    type="tel"
                    placeholder="+14155552671"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border p-2 w-full"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 w-full"
                >
                    {loading ? "Sending..." : "Continue"}
                </button>

                {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
        </main>
    );
}
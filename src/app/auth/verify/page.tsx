"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") || "";

    const [token, setToken] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: "sms",
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/admin"); // guard will decide next step
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleVerify} className="space-y-4">
                <h1 className="text-2xl font-bold">Enter OTP</h1>

                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="123456"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="border p-2 w-full"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 w-full"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>
            </form>
        </main>
    );
}
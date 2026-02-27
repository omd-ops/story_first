"use client"

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") || "";

    const [token, setToken] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: "sms",
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/admin");
        }
    };

    return (
        <form onSubmit={handleVerify}>
            <input
                type="text"
                placeholder="Enter OTP"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
            />
            <button type="submit">Verify</button>
            {error && <p>{error}</p>}
        </form>
    );
}
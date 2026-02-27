"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [goal, setGoal] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { error } = await supabase
            .from("users")
            .update({
                name,
                signup_goal: goal,
                status: "active",
            })
            .eq("id", user.id);

        if (!error) {
            router.push("/admin");
        }

        setLoading(false);
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="text-2xl font-bold">Complete your profile</h1>

                <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Your goal"
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="border p-2 w-full"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 w-full"
                >
                    {loading ? "Saving..." : "Finish"}
                </button>
            </form>
        </main>
    );
}
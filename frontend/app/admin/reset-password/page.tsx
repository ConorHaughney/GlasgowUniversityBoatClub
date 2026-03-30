"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, CheckCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (!res.ok) throw new Error("Failed to reset password. The link may be invalid or expired.");

            setSuccess(true);
            setTimeout(() => router.push("/admin"), 3000);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto border border-green-800">
                    <CheckCircle className="text-green-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
                <p className="text-gray-400">Your password has been successfully updated. Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-[#0f0f0f] border border-gray-800 rounded-xl p-8 shadow-2xl">
            <h1 className="text-2xl font-bold text-[#ffdc36] mb-6 text-center">Set New Password</h1>

            {error && <div className="p-3 mb-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none" placeholder="••••••••" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none" placeholder="••••••••" />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#ffdc36] text-black font-bold py-2.5 rounded-lg hover:bg-[#e6c229] transition disabled:opacity-50 flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Reset Password"}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Suspense fallback={<Loader2 className="animate-spin text-[#ffdc36]" />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, LogIn, ArrowLeft } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [view, setView] = useState<"login" | "forgot-password">("login");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const data = await res.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("adminRole", data.role || "");
            localStorage.setItem("adminPermissions", JSON.stringify(Array.isArray(data.permissions) ? data.permissions : []));
            router.push("/admin/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error("Failed to send reset email.");
            
            setMessage("If an account exists with that email, a reset link has been sent.");
        } catch (err) {
            setError("Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0f0f0f] border border-gray-800 rounded-xl p-8 shadow-2xl">
                {view === "login" ? (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-[#ffdc36] mb-2">Admin Login</h1>
                            <p className="text-gray-400 text-sm">Sign in to manage the boat club</p>
                        </div>

                        {error && <div className="p-3 mb-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm text-center">{error}</div>}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none transition-all" placeholder="admin@gubc.co.uk" />
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none transition-all" placeholder="••••••••" />
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button type="button" onClick={() => { setView("forgot-password"); setError(""); setMessage(""); }} className="text-xs text-gray-400 hover:text-[#ffdc36] transition-colors">Forgot Password?</button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-[#ffdc36] text-black font-bold py-2.5 rounded-lg hover:bg-[#e6c229] transition disabled:opacity-50 flex justify-center items-center gap-2 mt-6">{loading ? <Loader2 className="animate-spin" size={18} /> : <><LogIn size={18} /> Sign In</>}</button>
                        </form>
                    </>
                ) : (
                    <>
                        <button onClick={() => { setView("login"); setError(""); setMessage(""); }} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={16} />
                            <span>Back to Login</span>
                        </button>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-[#ffdc36] mb-2">Reset Password</h1>
                            <p className="text-gray-400 text-sm">Enter your email to receive a reset link</p>
                        </div>

                        {message && <div className="p-3 mb-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg text-sm">{message}</div>}
                        {error && <div className="p-3 mb-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm text-center">{error}</div>}

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none transition-all" placeholder="admin@gubc.co.uk" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-[#ffdc36] text-black font-bold py-2.5 rounded-lg hover:bg-[#e6c229] transition disabled:opacity-50 flex justify-center items-center gap-2 mt-6">{loading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Link"}</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
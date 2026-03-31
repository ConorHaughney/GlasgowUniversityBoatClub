"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Users, Send, ArrowLeft } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type AdminUser = {
    id: number;
    email: string;
    role: string;
};

export default function AdminResetLinksPage() {
    const router = useRouter();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [testToken, setTestToken] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const rawPermissions = localStorage.getItem("adminPermissions");
        const role = localStorage.getItem("adminRole");

        if (!token) {
            router.push("/admin");
            return;
        }

        const hasResetPermission = (() => {
            try {
                const parsed = rawPermissions ? JSON.parse(rawPermissions) : [];
                if (Array.isArray(parsed) && parsed.includes("RESET_LINKS_ADMIN")) {
                    return true;
                }
                return role === "ADMIN" || !rawPermissions;
            } catch {
                return role === "ADMIN" || !rawPermissions;
            }
        })();

        if (!hasResetPermission) {
            router.push("/admin/dashboard");
            return;
        }

        const loadUsers = async () => {
            setLoadingUsers(true);
            try {
                const res = await fetch(`${API_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("adminRole");
                    localStorage.removeItem("adminPermissions");
                    router.push("/admin");
                    return;
                }

                if (!res.ok) throw new Error("Failed to load users");

                const data: AdminUser[] = await res.json();
                setUsers(data);
            } catch {
                setError("Unable to load users.");
            } finally {
                setLoadingUsers(false);
            }
        };

        loadUsers();
    }, [router]);

    const toggleUser = (userId: number) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const sendResetLinks = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin");
            return;
        }

        if (selectedUserIds.length === 0) {
            setError("Select at least one user.");
            return;
        }

        setSubmitting(true);
        setError("");
        setMessage("");

        try {
            const responses = await Promise.all(
                selectedUserIds.map((userId) =>
                    fetch(`${API_URL}/api/auth/reset-password/admin/${userId}`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const failed = responses.filter((res) => !res.ok);
            if (failed.length > 0) {
                const firstFailed = failed[0];
                let serverMessage = "Some reset emails could not be sent.";

                try {
                    const contentType = firstFailed.headers.get("content-type") || "";
                    if (contentType.includes("application/json")) {
                        const body = await firstFailed.json();
                        if (body?.message && typeof body.message === "string") {
                            serverMessage = body.message;
                        } else if (body?.error && typeof body.error === "string") {
                            serverMessage = body.error;
                        }
                    } else {
                        const text = await firstFailed.text();
                        if (text.trim().length > 0) {
                            serverMessage = text;
                        }
                    }
                } catch {
                    // Keep fallback message when response body cannot be parsed.
                }

                throw new Error(serverMessage);
            }

            setMessage(`Reset links sent to ${selectedUserIds.length} user(s).`);
            setSelectedUserIds([]);
        } catch (e) {
            setError((e as Error).message || "Failed to send reset links.");
        } finally {
            setSubmitting(false);
        }
    };

    const openResetFormForTesting = () => {
        const token = testToken.trim();
        if (!token) {
            setError("Paste a token to open the reset form.");
            return;
        }

        router.push(`/admin/reset-password?token=${encodeURIComponent(token)}`);
    };

    if (loadingUsers) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-[#ffdc36]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-28">
            <div className="max-w-3xl mx-auto bg-[#0f0f0f] border border-gray-800 rounded-xl p-8 shadow-2xl">
                <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <Users className="text-[#ffdc36]" />
                        <h1 className="text-2xl font-bold text-[#ffdc36]">Send Password Reset Links</h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/dashboard")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-sm hover:border-[#ffdc36]"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                </div>

                {message && <div className="p-3 mb-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg text-sm">{message}</div>}
                {error && <div className="p-3 mb-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm">{error}</div>}

                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                    {users.map((user) => (
                        <label key={user.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-800 bg-black/50 cursor-pointer hover:border-gray-700 transition-colors">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedUserIds.includes(user.id)}
                                    onChange={() => toggleUser(user.id)}
                                    className="h-4 w-4 accent-[#ffdc36]"
                                />
                                <span className="text-white">{user.email}</span>
                            </div>
                            <span className="text-xs uppercase tracking-wider text-gray-400">{user.role}</span>
                        </label>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={sendResetLinks}
                    disabled={submitting || selectedUserIds.length === 0}
                    className="w-full mt-6 bg-[#ffdc36] text-black font-bold py-2.5 rounded-lg hover:bg-[#e6c229] transition disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {submitting ? "Sending..." : `Send Reset Links (${selectedUserIds.length})`}
                </button>

                <div className="mt-8 border-t border-gray-800 pt-6">
                    <h2 className="text-lg font-bold text-white mb-2">Manual Token Test</h2>
                    <p className="text-sm text-gray-400 mb-3">Paste a reset token to open the reset-password form directly.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={testToken}
                            onChange={(e) => setTestToken(e.target.value)}
                            placeholder="Paste token here"
                            className="flex-1 px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                        />
                        <button
                            type="button"
                            onClick={openResetFormForTesting}
                            className="bg-white text-black font-bold py-2.5 px-5 rounded-lg hover:bg-gray-200 transition"
                        >
                            Open Reset Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

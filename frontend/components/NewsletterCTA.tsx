"use client";

import React, { useState } from "react";
import { ArrowRight, Newspaper } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface NewsletterCTAProps {
    description?: string;
    showSocials?: boolean;
}

export default function NewsletterCTA({
    description = "Subscribe to our newsletter for the latest race results, club news, and exclusive updates delivered straight to your inbox.",
    showSocials = true,
}: NewsletterCTAProps) {
    const [subForm, setSubForm] = useState({ firstName: "", lastName: "", email: "" });
    const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [subMsg, setSubMsg] = useState("");

    async function handleSubscribe(e: React.FormEvent) {
        e.preventDefault();
        setSubStatus("loading");
        setSubMsg("");

        try {
            const res = await fetch(`${API_URL}/api/mailing-list/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subForm),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Subscription failed");
            }

            setSubStatus("success");
            setSubMsg("Thanks for subscribing!");
            setSubForm({ firstName: "", lastName: "", email: "" });
        } catch (err: unknown) {
            console.error(err);
            setSubStatus("error");
            if (err instanceof Error) {
                setSubMsg(err.message || "Something went wrong. Please try again.");
            } else {
                setSubMsg("Something went wrong. Please try again.");
            }
        }
    }

    return (
        <section className="relative py-32 bg-gray-1000 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[#ffdc36] transform skew-y-3 origin-bottom-left opacity-10"></div>

            <div className="relative max-w-4xl mx-auto px-4 text-center">
                <Newspaper size={64} className="text-[#ffdc36] mx-auto mb-8" />
                <h2 className="text-white uppercase tracking-tight mb-8">
                    <span className="block text-4xl sm:text-5xl lg:text-6xl">
                        Stay In
                    </span>
                    <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                        The Loop
                    </span>
                </h2>
                <p className="text-gray-300 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
                    {description}
                </p>
                <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={subForm.firstName}
                        onChange={(e) => setSubForm({ ...subForm, firstName: e.target.value })}
                        required
                        className="px-6 py-4 bg-white text-black tracking-wider placeholder:text-gray-400 placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#ffdc36] w-full"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={subForm.lastName}
                        onChange={(e) => setSubForm({ ...subForm, lastName: e.target.value })}
                        required
                        className="px-6 py-4 bg-white text-black tracking-wider placeholder:text-gray-400 placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#ffdc36] w-full"
                    />
                    <input
                        type="email"
                        placeholder="Your email address"
                        value={subForm.email}
                        onChange={(e) => setSubForm({ ...subForm, email: e.target.value })}
                        required
                        className="px-6 py-4 bg-white text-black tracking-wider placeholder:text-gray-400 placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#ffdc36] w-full"
                    />
                    <button
                        type="submit"
                        disabled={subStatus === "loading"}
                        className="bg-[#ffdc36] text-black px-10 py-4 uppercase tracking-wider hover:bg-white transition-colors inline-flex items-center justify-center gap-2 group w-full disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {subStatus === "loading" ? "Subscribing..." : "Subscribe"}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    {subMsg && (
                        <p className={`text-sm mt-2 ${subStatus === "success" ? "text-[#ffdc36]" : "text-red-400"}`}>
                            {subMsg}
                        </p>
                    )}
                </form>

                {showSocials && (
                    <div className="mt-12 flex justify-center gap-8">
                        <a href="https://www.instagram.com/glasgowuniboatclub/#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ffdc36] transition-colors transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </a>
                        <a href="https://www.facebook.com/glasgowuniversityrowing" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ffdc36] transition-colors transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
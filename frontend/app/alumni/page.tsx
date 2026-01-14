"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Mail, Heart } from "lucide-react";

// Reusable Image Placeholder
const ImagePlaceholder = ({
    label,
    height = "h-64",
}: {
    label: string;
    height?: string;
}) => (
    <div
        className={`w-full ${height} bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden group rounded-sm`}
    >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="text-center z-10 px-4">
            <span className="text-zinc-500 text-sm font-mono tracking-widest uppercase block">
                {label}
            </span>
        </div>
    </div>
);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function AlumniPage() {
    const [subForm, setSubForm] = useState({ firstName: "", lastName: "", email: "" });
    const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [subMsg, setSubMsg] = useState("");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://web-cdn.fixr.co/scripts/fixr-shop-widget.v1.min.js";
        script.setAttribute("data-fixr-shop-id", "f52a3ea9-c927-4430-a051-a2f3a1067e4d");
        script.async = true;

        const container = document.getElementById("fixr-widget-container");
        if (container) {
            container.innerHTML = "";
            container.appendChild(script);
        }
    }, []);

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

    const alumniEvents = [
        {
            title: "Annual Alumni Dinner",
            date: "November 15, 2025",
            location: "Glasgow University Union",
            description:
                "Join us for a black-tie evening celebrating the past, present, and future of GUBC.",
        },
        {
            title: "Henley Royal Regatta Drinks",
            date: "July 4, 2025",
            location: "Henley-on-Thames",
            description:
                "Meet up with fellow alumni at the riverbank for drinks and cheering on the current crews.",
        },
        {
            title: "Head of the River Race",
            date: "March 2025",
            location: "London",
            description: "Support the GUBC crews taking on the Tideway.",
        },
    ];

    return (
        <section id="alumni" className="bg-zinc-950 text-gray-200 min-h-screen mt-20">
            <div className="mx-auto px-6 sm:px-8 lg:px-10">
                {/* Hero Section */}
                <section className="relative py-24 bg-black text-white overflow-hidden">
                    <div className="absolute top-5 right-5 text-white/5 text-[15rem] uppercase tracking-tight leading-none pointer-events-none">
                        Alumni
                    </div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#ffdc36] transform origin-bottom-left skew-x-6 -translate-x-1/3 opacity-20"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                        <h1 className="text-white uppercase tracking-tight mb-6">
                            <span className="block text-5xl sm:text-6xl lg:text-7xl">
                                GUBC
                            </span>
                            <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">
                                Alumni
                            </span>
                        </h1>
                        <p className="text-gray-300 text-xl max-w-3xl">
                            Once a rower, always a rower. Stay connected with the club and your
                            crewmates.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
                    {/* Welcome / Intro */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Welcome Back
                            </h2>
                            <p>
                                The Glasgow University Boat Club alumni community is a vital part
                                of our club&apos;s legacy. Whether you graduated last year or decades
                                ago, your support and involvement help us continue to compete at
                                the highest levels and introduce new students to the sport of
                                rowing.
                            </p>
                            <p>
                                We invite you to stay connected, attend our events, and support
                                the next generation of athletes wearing the Black and Gold.
                            </p>
                            <div className="pt-4">
                                <a
                                    href="mailto:alumni@gubc.co.uk"
                                    className="inline-flex items-center gap-2 text-[#ffdc36] hover:text-white transition-colors font-bold uppercase tracking-wider text-sm"
                                >
                                    <Mail size={18} /> Contact Alumni Rep
                                </a>
                            </div>
                        </div>
                        <div>
                            <ImagePlaceholder label="Alumni Crew at Henley" height="h-80" />
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div>
                        <div className="flex items-end justify-between mb-10 border-b border-zinc-800 pb-4">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                                Alumni <span className="text-[#ffdc36]">Events</span>
                            </h2>
                            <span className="text-zinc-500 text-sm hidden sm:block">
                                Join us at our next gathering
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {alumniEvents.map((event, idx) => (
                                <div
                                    key={idx}
                                    className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-sm hover:border-[#ffdc36]/30 transition-all group"
                                >
                                    <div className="flex items-center gap-3 text-[#ffdc36] mb-4">
                                        <Calendar size={20} />
                                        <span className="font-mono text-sm font-bold uppercase">
                                            {event.date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ffdc36] transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-zinc-500 text-sm mb-4 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-zinc-700"></span>{" "}
                                        {event.location}
                                    </p>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FIXR Ticket Area */}
                    <div className="border-t border-zinc-800 pt-16">
                        <div className="flex items-end justify-between mb-10">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                                Book <span className="text-[#ffdc36]">Tickets</span>
                            </h2>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden p-4 min-h-[500px]">
                            <div id="fixr-widget-container" className="w-full"></div>
                        </div>
                    </div>

                    {/* Support / Fundraising */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffdc36] opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center gap-3 text-[#ffdc36] mb-2">
                                    <Heart size={24} />
                                    <span className="font-bold uppercase tracking-widest text-sm">
                                        Support the Club
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white">
                                    The 1867 Fund
                                </h2>
                                <p className="text-zinc-400 text-lg leading-relaxed">
                                    Rowing is an expensive sport, and we rely on the generosity of
                                    our alumni to maintain our fleet and facilities. Your
                                    contributions go directly towards purchasing new boats,
                                    repairing equipment, and subsidising training camps for
                                    students.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <button className="bg-[#ffdc36] text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-[#e6c229] transition-colors">
                                        Donate Now
                                    </button>
                                    <button className="border border-zinc-700 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                            <div className="lg:col-span-1 border-l border-zinc-800 pl-0 lg:pl-12">
                                <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
                                    Recent Purchases
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-400">New Empacher 8+</span>
                                        <span className="text-[#ffdc36] font-mono">2024</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-400">Concept2 Erg Set</span>
                                        <span className="text-[#ffdc36] font-mono">2023</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-400">Launch Engine</span>
                                        <span className="text-[#ffdc36] font-mono">2023</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Stay in the Loop
                        </h2>
                        <p className="text-zinc-400 mb-8">
                            Sign up for our quarterly alumni newsletter to receive race
                            reports, event invitations, and club news directly to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-4 max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={subForm.firstName}
                                onChange={(e) => setSubForm({ ...subForm, firstName: e.target.value })}
                                required
                                className="bg-black border border-zinc-800 text-white px-4 py-3 rounded-sm focus:border-[#ffdc36] focus:outline-none transition-colors w-full"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={subForm.lastName}
                                onChange={(e) => setSubForm({ ...subForm, lastName: e.target.value })}
                                required
                                className="bg-black border border-zinc-800 text-white px-4 py-3 rounded-sm focus:border-[#ffdc36] focus:outline-none transition-colors w-full"
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={subForm.email}
                                onChange={(e) => setSubForm({ ...subForm, email: e.target.value })}
                                required
                                className="bg-black border border-zinc-800 text-white px-4 py-3 rounded-sm focus:border-[#ffdc36] focus:outline-none transition-colors w-full"
                            />
                            <button
                                type="submit"
                                disabled={subStatus === "loading"}
                                className="bg-white text-black px-8 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors w-full disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {subStatus === "loading" ? "Subscribing..." : "Subscribe"}
                            </button>
                            {subMsg && (
                                <p className={`text-sm mt-2 ${subStatus === "success" ? "text-[#ffdc36]" : "text-red-400"}`}>
                                    {subMsg}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

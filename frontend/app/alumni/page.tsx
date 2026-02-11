"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Mail } from "lucide-react";
import NewsletterCTA from "@/components/NewsletterCTA";

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
        <section id="alumni" className="bg-gray-1000 mt-20 overflow-hidden">
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">
                    {/* Welcome / Intro */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
                            <div className="mb-16">
                            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                            <h2 className="text-white uppercase tracking-tight">
                                <span className="block text-4xl sm:text-5xl lg:text-6xl">
                                    Welcome
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                                    Back
                                </span>
                            </h2>
                        </div>
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
                                    href="mailto:gubcpresident1867@gmail.com"
                                    className="inline-flex items-center gap-2 text-[#ffdc36] hover:text-white transition-colors font-bold uppercase tracking-wider text-sm"
                                >
                                    <Mail size={18} /> Contact our Club President
                                </a>
                            </div>
                        </div>
                        <div>
                            <div className="relative w-full h-80 rounded-sm overflow-hidden border border-zinc-800 group">
                                <Image
                                    src="https://nfinlwbvbsoonbxqflvh.supabase.co/storage/v1/object/public/site_images/oldHenley.jpg"
                                    alt="Alumni Crew at Henley"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events
                    <div>
                        <div className="mb-16">
                            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                            <h2 className="text-white uppercase tracking-tight">
                                <span className="block text-4xl sm:text-5xl lg:text-6xl">
                                    Alumni
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                                    Events
                                </span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {alumniEvents.map((event, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white border-l-4 border-[#ffdc36] p-6 shadow-lg h-full flex flex-col group hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 text-[#ffdc36] mb-4">
                                        <Calendar size={20} />
                                        <span className="font-mono text-sm font-bold uppercase text-black">
                                            {event.date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-wide group-hover:text-[#ffdc36] transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-[#ffdc36]"></span>{" "}
                                        {event.location}
                                    </p>
                                    <p className="text-gray-700 text-sm leading-relaxed flex-1">
                                        {event.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    {/* FIXR Ticket Area */}
                    <div>
                        <div className="mb-16">
                            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                            <h2 className="text-white uppercase tracking-tight">
                                <span className="block text-4xl sm:text-5xl lg:text-6xl">
                                    Book
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                                    Tickets
                                </span>
                            </h2>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden p-4 min-h-[500px]">
                            <div id="fixr-widget-container" className="w-full"></div>
                        </div>
                    </div>
                </div>

                {/* Newsletter CTA */}
                <NewsletterCTA
                    description="Sign up for our newsletter to receive race reports, event invitations, and club news directly to your inbox."
                />
            </div>
        </section>
    );
}

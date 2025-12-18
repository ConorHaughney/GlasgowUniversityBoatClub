"use client";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  PartyPopper,
  Trophy,
  Users,
  ChevronRight,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

type EventType = {
  id?: number;
  date: string;
  day: string;
  month: string;
  endDate?: string;
  endDay?: string;
  endMonth?: string;
  title: string;
  location: string;
  time: string;
  type: "Competition" | "Social" | "Recruitment" | string;
  description: string;
  featured: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  multiDay?: boolean;
};

function getTypeColor(type: string) {
  switch (type) {
    case "Competition":
      return {
        bg: "bg-black",
        text: "text-[#ffdc36]",
        border: "border-[#ffdc36]",
      };
    case "Social":
      return { bg: "bg-[#ffdc36]", text: "text-black", border: "border-black" };
    case "Recruitment":
      return {
        bg: "bg-gray-800",
        text: "text-white",
        border: "border-gray-800",
      };
    default:
      return {
        bg: "bg-red-500",
        text: "text-white",
        border: "border-[#ffdc36]",
      };
  }
}

function parseIsoToDayMonth(iso?: string) {
  if (!iso) return { day: "", month: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    const parsed = Date.parse(iso);
    if (isNaN(parsed)) return { day: "", month: "" };
    const d2 = new Date(parsed);
    return {
      day: `${d2.getDate().toString().padStart(2, "0")}`,
      month: d2.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
    };
  }
  return {
    day: `${d.getDate().toString().padStart(2, "0")}`,
    month: d.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
  };
}

function iconForType(type: string) {
  if (type === "Social") return PartyPopper;
  if (type === "Recruitment") return Users;
  return Trophy;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
        const res = await fetch(`${API_BASE}/api/events`);
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: EventType[] = data.map((e: any) => {
          const start = parseIsoToDayMonth(e.date);
          const sameDay = e.endDate && e.endDate === e.date;
          const multiDay = Boolean(e.endDate) && !sameDay;
          const end = multiDay
            ? parseIsoToDayMonth(e.endDate)
            : { day: "", month: "" };
          return {
            id: e.id,
            date: e.date,
            day: start.day,
            month: start.month,
            endDate: multiDay ? e.endDate : undefined,
            endDay: multiDay ? end.day : undefined,
            endMonth: multiDay ? end.month : undefined,
            title: e.title,
            location: e.location,
            time: e.time || "",
            type: e.type || "",
            description: e.description || "",
            featured: Boolean(e.featured),
            icon: iconForType(e.type),
            multiDay,
          } as EventType;
        });

        // Sort by date ascending
        mapped.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (mounted) setEvents(mapped);
      } catch (err) {
        console.error("Events load error:", err);
        if (mounted) setError("Failed to load events. Please try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="">
      {/* Page wrapper to mirror Committee layout */}
      <section id="events" className="bg-gray-1000 mt-20">
        <div className="mx-auto px-6 sm:px-8 lg:px-10">
          {/* Hero Section (styled like Committee) */}
          <section className="relative py-24 bg-black text-white overflow-hidden">
            <div className="absolute top-5 right-5 text-white/5 text-[15rem] uppercase tracking-tight leading-none pointer-events-none">
              Events
            </div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#ffdc36] transform origin-bottom-left skew-x-6 -translate-x-1/3 opacity-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
              <h1 className="text-white uppercase tracking-tight mb-6">
                <span className="block text-5xl sm:text-6xl lg:text-7xl">
                  Events
                </span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">
                  Calendar
                </span>
              </h1>
              <p className="text-gray-300 text-xl max-w-3xl">
                Races, socials, and everything happening at GUBC
              </p>
            </div>
          </section>

          {/* Featured Events */}
          <section className="py-24 bg-gray-1000">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-16">
                <div className="h-1 w-20 bg-[#ffdc36] mb-6" />
                <h2 className="text-white uppercase tracking-tight">
                  <span className="block text-4xl sm:text-5xl lg:text-6xl">
                    Featured
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                    Events
                  </span>
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-24">
                {loading ? (
                  <div className="col-span-full flex justify-center py-20">
                    <Loader2 className="animate-spin text-[#ffdc36]" size={48} />
                  </div>
                ) : error ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                    <AlertCircle size={48} className="mb-4 text-red-500" />
                    <p>{error}</p>
                  </div>
                ) : (
                  events
                    .filter((event) => event.featured)
                    .map((event) => {
                      const colors = getTypeColor(event.type);
                      const Icon = event.icon;
                      return (
                        <div
                          key={event.id || event.date}
                          className="group relative"
                        >
                          <div
                            className={`${colors.bg} border-4 border-[#ffdc36] p-8 h-full relative overflow-hidden`}
                          >
                            <div
                              className={`absolute bottom-0 right-0 ${colors.text} opacity-10`}
                            >
                              <Icon size={200} />
                            </div>

                            <div className="relative">
                              <div className="flex items-start justify-between mb-6">
                                {event.multiDay ? (
                                  <div
                                    className={`${colors.text} flex items-center gap-3`}
                                  >
                                    <div>
                                      <div className="text-6xl uppercase tracking-tighter leading-none mb-2">
                                        {event.day}
                                      </div>
                                      <div className="text-2xl uppercase tracking-wider">
                                        {event.month}
                                      </div>
                                    </div>

                                    {/* middle: arrow with icon overlay */}
                                    <div className="flex flex-col items-center justify-center px-3">
                                      <div className="relative w-12 h-12">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <ArrowRight
                                            size={32}
                                            className="block"
                                          />
                                        </div>
                                      </div>
                                      <div className="h-0.5 w-8 bg-current mt-1"></div>
                                    </div>

                                    <div>
                                      <div className="text-6xl uppercase tracking-tighter leading-none mb-2">
                                        {event.endDay}
                                      </div>
                                      <div className="text-2xl uppercase tracking-wider">
                                        {event.endMonth}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className={`${colors.text}`}>
                                    <div className="text-6xl uppercase tracking-tighter leading-none mb-2">
                                      {event.day}
                                    </div>
                                    <div className="text-2xl uppercase tracking-wider">
                                      {event.month}
                                    </div>
                                  </div>
                                )}
                                <div
                                  className={`px-4 py-2 border-2 ${colors.border} uppercase text-sm tracking-wider`}
                                >
                                  {event.type}
                                </div>
                              </div>

                              <h3
                                className={`${
                                  colors.text === "text-black"
                                    ? "text-black"
                                    : "text-white"
                                } uppercase tracking-wide text-3xl mb-4 leading-tight`}
                              >
                                {event.title}
                              </h3>
                              <p
                                className={`${
                                  colors.text === "text-black"
                                    ? "text-gray-700"
                                    : "text-gray-300"
                                } text-lg mb-6 leading-relaxed`}
                              >
                                {event.description}
                              </p>

                              <div className="space-y-3">
                                <div
                                  className={`flex items-center gap-3 ${
                                    colors.text === "text-black"
                                      ? "text-gray-700"
                                      : "text-gray-300"
                                  }`}
                                >
                                  <MapPin size={20} />
                                  <span className="text-lg">
                                    {event.location}
                                  </span>
                                </div>
                                <div
                                  className={`flex items-center gap-3 ${
                                    colors.text === "text-black"
                                      ? "text-gray-700"
                                      : "text-gray-300"
                                  }`}
                                >
                                  <Clock size={20} />
                                  <span className="text-lg">{event.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              {/* All Events Timeline */}
              <div className="mb-16">
                <div className="h-1 w-20 bg-[#ffdc36] mb-6" />
                <h2 className="text-white uppercase tracking-tight">
                  <span className="block text-4xl sm:text-5xl lg:text-6xl">
                    All
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                    Events
                  </span>
                </h2>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-12">
                {["All", "Competition", "Social", "Recruitment"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-2 uppercase tracking-wider border-2 transition-all ${
                      filter === f
                        ? "bg-[#ffdc36] border-[#ffdc36] text-black"
                        : "border-gray-700 text-gray-400 hover:border-[#ffdc36] hover:text-[#ffdc36]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Timeline View */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffdc36] hidden md:block" />
                <div className="space-y-0">
                  {events
                    .filter((e) => filter === "All" || e.type === filter)
                    .length === 0 &&
                    !loading && (
                      <div className="py-12 text-gray-500 text-lg pl-8">
                        No events found.
                      </div>
                    )}
                  {events
                    .filter((e) => filter === "All" || e.type === filter)
                    .map((event) => {
                      const colors = getTypeColor(event.type);
                      const Icon = event.icon;
                      return (
                        <div
                          key={event.id || event.date}
                          className="relative group"
                        >
                          <div
                            className={`absolute left-0 top-8 w-4 h-4 ${colors.bg} border-4 border-white rounded-full -translate-x-1.5 hidden md:block z-10`}
                          />
                          <div className="md:ml-12 mb-8">
                            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                              <div className="flex-shrink-0">
                                {event.multiDay ? (
                                  <div
                                    className={`${colors.bg} ${colors.text} px-6 py-4 flex items-center gap-4 group-hover:scale-105 transition-transform duration-300`}
                                  >
                                    <div className="text-center">
                                      <div className="text-3xl uppercase tracking-tight leading-none mb-1">
                                        {event.day}
                                      </div>
                                      <div className="text-xs uppercase tracking-wider">
                                        {event.month}
                                      </div>
                                    </div>

                                    {/* middle: arrow with icon overlay */}
                                    <div className="flex flex-col items-center justify-center px-3">
                                      <div className="mb-1">
                                        {/* icon moved up */}
                                        <Icon size={18} />
                                      </div>
                                      <div className="relative w-12 h-12 flex items-center justify-center">
                                        {/* arrow moved down */}
                                        <ArrowRight
                                          size={32}
                                          className="opacity-60"
                                        />
                                      </div>
                                      <div className="h-0.5 w-8 bg-current mt-1"></div>
                                    </div>

                                    <div className="text-center">
                                      <div className="text-3xl uppercase tracking-tight leading-none mb-1">
                                        {event.endDay}
                                      </div>
                                      <div className="text-xs uppercase tracking-wider">
                                        {event.endMonth}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={`${colors.bg} ${colors.text} w-32 h-32 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                  >
                                    <Icon size={32} className="mb-2" />
                                    <div className="text-3xl uppercase tracking-tight leading-none mb-1">
                                      {event.day}
                                    </div>
                                    <div className="text-sm uppercase tracking-wider">
                                      {event.month}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Event Card */}
                              <div className="flex-1 bg-white border-l-4 border-[#ffdc36] p-6 group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                  <div className="flex-1">
                                    <h3 className="text-black uppercase tracking-wide text-2xl">
                                      {event.title}
                                    </h3>
                                    {event.multiDay && (
                                      <div className="mt-2 inline-flex items-center gap-2 text-[#ffdc36] text-sm uppercase tracking-wider">
                                        <Calendar size={14} />
                                        <span>Multi-Day Event</span>
                                      </div>
                                    )}
                                  </div>
                                  <div
                                    className={`${colors.bg} ${colors.text} px-4 py-2 uppercase text-xs tracking-wider self-start`}
                                  >
                                    {event.type}
                                  </div>
                                </div>

                                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                                  {event.description}
                                </p>

                                <div className="flex flex-wrap gap-6 text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <MapPin size={18} />
                                    <span>{event.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span>{event.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[#ffdc36] transform -skew-y-3 origin-top-right translate-y-1/2 opacity-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Calendar size={64} className="text-[#ffdc36] mx-auto mb-8" />
          <h2 className="text-white uppercase tracking-tight mb-6">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">
              Never Miss
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
              An Event
            </span>
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Want to receive event updates and race information? Join our mailing
            list or follow us on social media.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-[#ffdc36] text-black px-10 py-4 uppercase tracking-wider hover:bg-white transition-colors inline-flex items-center justify-center gap-2 group"
            >
              Get Updates
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#alumni"
              className="border-2 border-[#ffdc36] text-[#ffdc36] px-10 py-4 uppercase tracking-wider hover:bg-[#ffdc36] hover:text-black transition-colors inline-flex items-center justify-center gap-2"
            >
              View Full Calendar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

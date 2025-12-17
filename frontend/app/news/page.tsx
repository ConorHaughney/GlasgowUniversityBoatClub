"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Newspaper } from "lucide-react";
import { ImageWithFallback } from "@/components/Fallback";

type ApiArticle = {
  id: number | string;
  title: string;
  body?: string;
  image_url?: string;
  author?: string;
  published_at?: string;
};

function excerpt(text?: string, len = 120) {
  if (!text) return "";
  const plain = text.replace(/<[^>]*>/g, "").trim();
  if (plain.length <= len) return plain;
  return plain.slice(0, len).replace(/\s+\S*$/, "") + "…";
}

function formatDayMonth(iso?: string) {
  if (!iso) return { day: "", month: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "", month: "" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleString(undefined, { month: "short" }),
  };
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function NewsPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ApiArticle[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/api/news`);
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        if (!mounted) return;
        setArticles(Array.isArray(json) ? json : []);
      } catch {
        if (mounted) setArticles([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const recent = (articles ?? []).slice().sort((a, b) => {
    if (a.published_at && b.published_at)
      return +new Date(b.published_at) - +new Date(a.published_at);
    const ai = Number(a.id);
    const bi = Number(b.id);
    if (!Number.isNaN(ai) && !Number.isNaN(bi)) return bi - ai;
    return 0;
  });

  const [visibleCount, setVisibleCount] = useState(4);
  const [stage, setStage] = useState<0 | 1>(0); // 0 = initial, 1 = showed more (button becomes "See all" and navigates)

  const visibleRecent = recent.slice(0, visibleCount);

  function handleSeeButton() {
    if (stage === 0) {
      setVisibleCount((v) => Math.min(v + 4, recent.length));
      setStage(1);
    } else {
      router.push("/news/all");
    }
  }

  return (
    <section id="news" className="bg-gray-1000 mt-20">
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        {/* Hero Section */}
        <section className="relative py-24 bg-black text-white overflow-hidden">
          <div className="absolute top-5 right-5 text-white/5 text-[15rem] uppercase tracking-tight leading-none pointer-events-none">
            News
          </div>

          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#ffdc36] transform origin-bottom-left skew-x-6 -translate-x-1/3 opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
            <h1 className="text-white uppercase tracking-tight mb-6">
              <span className="block text-5xl sm:text-6xl lg:text-7xl">
                Latest
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">
                News
              </span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl">
              Stay updated with the latest news from Glasgow University Boat
              Club.
            </p>
          </div>
        </section>

        {/* Recent News Grid */}
        <section className="py-24 bg-gray-1000">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
              <h2 className="text-white uppercase tracking-tight">
                <span className="block text-4xl sm:text-5xl lg:text-6xl">
                  Recent
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                  Updates
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="text-gray-300">Loading…</div>
            ) : visibleRecent.length === 0 ? (
              <div className="text-gray-300">No recent articles.</div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {visibleRecent.map((item) => {
                    const { day, month } = formatDayMonth(item.published_at);
                    return (
                      <div key={String(item.id)} className="group relative">
                        <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[#ffdc36] -z-10"></div>

                        <div className="bg-white overflow-hidden h-full flex flex-col">
                          <div className="relative overflow-hidden h-44">
                            {item.image_url && (
                              <ImageWithFallback
                                src={item.image_url}
                                alt={item.title}
                                fill
                                className="object-cover transition-all duration-500"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
                            <div className="absolute bottom-3 left-3 bg-[#ffdc36] text-black px-3 py-1 flex items-center gap-3">
                              <div className="text-center">
                                <div className="text-lg uppercase tracking-tight leading-none">
                                  {day}
                                </div>
                                <div className="text-xs uppercase tracking-wider">
                                  {month}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 flex-1 flex flex-col border-l-4 border-[#ffdc36]">
                            <h3 className="text-black uppercase tracking-wide text-lg mb-2 leading-tight group-hover:text-[#ffdc36] transition-colors">
                              <Link href={`/news/${item.id}`}>
                                {item.title}
                              </Link>
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4 flex-1">
                              {excerpt(item.body, 100)}
                            </p>
                            <div className="flex items-center gap-2 text-black group-hover:text-[#ffdc36] uppercase text-xs tracking-wider transition-colors">
                              <Link
                                href={`/news/${item.id}`}
                                className="inline-flex items-center gap-2"
                              >
                                <span>Read More</span>
                                <ArrowRight
                                  size={16}
                                  className="group-hover:translate-x-1 transition-transform"
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* See more / See all button */}
                {recent.length > visibleCount && (
                  <div className="mt-10 flex flex-col items-center">
                    <button
                      onClick={handleSeeButton}
                      className="px-8 py-3 bg-[#ffdc36] text-black uppercase text-sm font-semibold tracking-wider hover:bg-[#e6c82f] transition-colors cursor-pointer"
                    >
                      {stage === 0 ? "See more" : "See all"}
                    </button>

                    {stage === 1 && visibleCount > 4 && (
                      <button
                        onClick={() => {
                          setVisibleCount(4);
                          setStage(0);
                        }}
                        className="mt-2 text-sm text-gray-300 hover:underline cursor-pointer"
                        aria-label="Show fewer articles"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="relative py-32 bg-grey-1000 text-white overflow-hidden">
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
              Subscribe to our newsletter for the latest race results, club
              news, and exclusive updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-6 py-4 bg-white text-black uppercase tracking-wider placeholder:text-gray-400 placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#ffdc36] flex-1 max-w-md"
              />
              <button className="bg-[#ffdc36] text-black px-10 py-4 uppercase tracking-wider hover:bg-white transition-colors inline-flex items-center justify-center gap-2 group">
                Subscribe
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
import React from "react";
import Image from "next/image";
import NewsletterCTA from "@/components/NewsletterCTA";

// Reusable Image Placeholder Component
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
            <svg
                className="w-12 h-12 text-zinc-700 mx-auto mb-3 group-hover:text-[#ffdc36] transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
            <span className="text-zinc-500 text-sm font-mono tracking-widest uppercase block">
                {label}
            </span>
        </div>
    </div>
);

export default function OurHistoryPage() {
    const milestones = [
        {
            year: "1867",
            title: "Foundation",
            description:
                "Glasgow University Boat Club (GUBC) is founded, establishing itself as one of the oldest rowing clubs in the UK.",
        },
        {
            year: "1877",
            title: "The First Scottish Boat Race",
            description:
                "The inaugural contest against Edinburgh University. This rivalry is the third-oldest varsity boat race in the world.",
        },
        {
            year: "1924",
            title: "A Historic Home",
            description:
                'The East Boathouse is built on Glasgow Green. For over a century, this building served as the spiritual home of the "Black and Gold".',
        },
        {
            year: "1936",
            title: "Henley Debut",
            description:
                "The club competes at the prestigious Henley Royal Regatta for the first time, sending a four-man crew to race for the Wyfold Cup.",
        },
        {
            year: "2004",
            title: "The Great Merger",
            description:
                "GUBC merges with the University Ladies Boat Club, ending over a century of separation and creating a unified, inclusive powerhouse.",
        },
        {
            year: "2012",
            title: "The 13-Year Streak",
            description:
                "The Men’s First VIII concludes a golden era, having won the Scottish Boat Race for 13 consecutive years (2000–2012).",
        },
        {
            year: "2025",
            title: "Storm Éowyn",
            description:
                "In February, Storm Éowyn causes significant structural damage to the 1924 boathouse, forcing an evacuation and rallying the community to rebuild.",
        },
    ];

    return (
        <section id="our-history" className="bg-gray-1000 mt-20 overflow-hidden">
            <div className="mx-auto px-6 sm:px-8 lg:px-10">
                {/* Hero Section */}
                <section className="relative py-24 bg-black text-white overflow-hidden">
                    <div className="absolute top-5 right-5 text-white/5 text-[15rem] uppercase tracking-tight leading-none pointer-events-none">
                        History
                    </div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#ffdc36] transform origin-bottom-left skew-x-6 -translate-x-1/3 opacity-20"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                        <h1 className="text-white uppercase tracking-tight mb-6">
                            <span className="block text-5xl sm:text-6xl lg:text-7xl">
                                Our
                            </span>
                            <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">
                                History
                            </span>
                        </h1>
                        <p className="text-gray-300 text-xl max-w-3xl">
                            Discover the rich history of Glasgow University Boat Club since
                            1867.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">
                    {/* Introduction Grid */}
                    <div>
                        <div className="mb-16">
                            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                            <h2 className="text-white uppercase tracking-tight">
                                <span className="block text-4xl sm:text-5xl lg:text-6xl">
                                    A Legacy of
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                                    Excellence
                                </span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
                                <p>
                                    <span className="text-white font-semibold">
                                        Founded in 1867,
                                    </span>{" "}
                                    Glasgow University Boat Club (GUBC) stands as a pillar of
                                    Scottish sporting tradition. For over 150 years, the
                                    &ldquo;Black and Gold&rdquo; has represented the University on
                                    waters across the globe, from the River Clyde to the tideway of
                                    London.
                                </p>
                                <p>
                                    Originally established as a male-only society, the club
                                    underwent a transformation in
                                    <span className="text-[#ffdc36]"> 2004</span> by merging with
                                    the University Ladies Boat Club. This union created one of the
                                    largest and most competitive mixed-gender sports clubs in the
                                    country, fostering talent from complete novices to World
                                    Champions.
                                </p>
                            </div>
                            <div className="w-full">
                                <div className="relative w-full h-80 rounded-sm overflow-hidden border border-zinc-800 group">
                                    <Image
                                        src="https://nfinlwbvbsoonbxqflvh.supabase.co/storage/v1/object/public/site_images/7DB6E0AEFC3D4415BBF00D820A6B07F2.jpg"
                                        alt="Archival Photo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-zinc-600 text-xs mt-2 font-mono text-right">
                                    Archival Photo
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* The Scottish Boat Race Section */}
                    <div>
                        <div className="mb-16">
                            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                            <h2 className="text-white uppercase tracking-tight">
                                <span className="block text-4xl sm:text-5xl lg:text-6xl">
                                    The Scottish
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                                    Boat Race
                                </span>
                            </h2>
                        </div>
                        <div className="flex flex-col md:flex-row gap-12">
                            <div className="md:w-1/2 order-2 md:order-1">
                                <div className="relative w-full h-full min-h-[400px] rounded-sm overflow-hidden border border-zinc-800 group">
                                    <Image
                                        src="https://nfinlwbvbsoonbxqflvh.supabase.co/storage/v1/object/public/site_images/boatRace.jpeg"
                                        alt="Action Shot: The Scottish Boat Race"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="md:w-1/2 order-1 md:order-2 flex flex-col justify-center">
                                <p className="text-zinc-400 mb-6 leading-relaxed text-lg">
                                    Our annual contest
                                    against the University of Edinburgh is the{" "}
                                    <span className="text-white">
                                        third-oldest varsity boat race in the world
                                    </span>
                                    , behind only Oxford–Cambridge and Harvard–Yale.
                                </p>
                                <p className="text-zinc-400 leading-relaxed text-lg">
                                    The race has evolved from coxed fours in the 19th century to the
                                    powerful eights of today. A particular point of pride remains
                                    the Men&apos;s 1st VIII &ldquo;Golden Era,&ldquo; where GUBC held the trophy for{" "}
                                    <span className="text-white">13 consecutive years</span> between
                                    2000 and 2012.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div>
                        <div className="mb-16">
                            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                            <h2 className="text-white uppercase tracking-tight">
                                <span className="block text-4xl sm:text-5xl lg:text-6xl">
                                    Timeline of
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                                    Events
                                </span>
                            </h2>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <div className="border-l-2 border-zinc-800 ml-4 space-y-16">
                                {milestones.map((item, index) => (
                                    <div key={index} className="relative pl-12 group">
                                        <span className="absolute -left-[9px] top-2 h-4 w-4 rounded-full border-2 border-[#ffdc36] bg-black group-hover:bg-[#ffdc36] transition-colors duration-300"></span>
                                        <span className="text-[#ffdc36] font-mono text-sm tracking-widest uppercase mb-1 block">
                                            {item.year}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-zinc-500 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notable Alumni / Hall of Fame */}
                    <div>
                        <div className="mb-16">
                            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                            <h2 className="text-white uppercase tracking-tight">
                                <span className="block text-4xl sm:text-5xl lg:text-6xl">
                                    Hall of
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                                    Fame
                                </span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Alumni 1 */}
                            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-sm hover:border-[#ffdc36]/30 transition-all group">
                                <div className="mb-6 overflow-hidden rounded-sm">
                                    <div className="relative w-full h-96 rounded-sm overflow-hidden border border-zinc-800 group">
                                        <Image
                                            src="https://nfinlwbvbsoonbxqflvh.supabase.co/storage/v1/object/public/site_images/lauraM.jpg"
                                            alt="Laura McKenzie"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Laura McKenzie
                                </h3>
                                <p className="text-[#ffdc36] text-xs uppercase tracking-wider mt-1 mb-3">
                                    British Beach Sprinter
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    Studied Engineering at Glasgow while competing for GUBC. Transitioned to Beach Sprints, winning Gold for Scotland at the 2022 Commonwealth Beach Sprints and Silver at the 2023 World Championships. Currently pursuing a PhD at the University.
                                </p>
                            </div>

                            {/* Alumni 2 */}
                            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-sm hover:border-[#ffdc36]/30 transition-all group">
                                <div className="mb-6 overflow-hidden rounded-sm">
                                    <div className="relative w-full h-96 rounded-sm overflow-hidden border border-zinc-800 group">
                                        <Image
                                            src="https://nfinlwbvbsoonbxqflvh.supabase.co/storage/v1/object/public/site_images/Imogen-Walsh-Media-Shirt.jpg"
                                            alt="Imogen Walsh"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white">Imogen Walsh</h3>
                                <p className="text-[#ffdc36] text-xs uppercase tracking-wider mt-1 mb-3">
                                    World Champion
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    Learned to row at GUBC and went on to become a
                                    two time gold medalist at the World Championship in
                                    the lightweight quad and silver medalist in the lightweight single
                                </p>
                            </div>

                            {/* Alumni 3 */}
                            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-sm hover:border-[#ffdc36]/30 transition-all group">
                                <div className="mb-6 overflow-hidden rounded-sm">
                                    <div className="relative w-full h-96 rounded-sm overflow-hidden border border-zinc-800 group">
                                        <Image
                                            src="https://nfinlwbvbsoonbxqflvh.supabase.co/storage/v1/object/public/site_images/Miriam_Payne.jpg"
                                            alt="Miriam Payne"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white">Miriam Payne</h3>
                                <p className="text-[#ffdc36] text-xs uppercase tracking-wider mt-1 mb-3">
                                    Atlantic Rower
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    Miriam Payne competed for GUBC and served as Women’s Captain while studying Physics and Astrophysics at Glasgow. In 2021, she set the world record for the fastest solo female Atlantic crossing and recently completed a historic 165-day unsupported row across the Pacific from South America to Australia in the first all-female crew to do so.                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <NewsletterCTA />
            </div>
        </section>
    );
}

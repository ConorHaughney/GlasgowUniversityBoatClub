import { GraduationCap, Briefcase, Globe, Pencil, ClipboardList, CalendarDays } from "lucide-react";

export default function JoinPage() {
    return (
        <section id="join" className="bg-gray-1000 mt-20">
            <div className="mx-auto px-6 sm:px-8 lg:px-10">
                {/* Hero Section */}
                <section className="relative py-24 bg-black text-white overflow-hidden">
                    <div className="absolute top-5 right-5 text-white/5 text-[15rem] uppercase tracking-tight leading-none pointer-events-none">
                        Join Us
                    </div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#ffdc36] transform origin-bottom-left skew-x-6 -translate-x-1/3 opacity-20"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
                        <h1 className="text-white uppercase tracking-tight mb-6">
                            <span className="block text-5xl sm:text-6xl lg:text-7xl">Join</span>
                            <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">GUBC</span>
                        </h1>
                        <div className="flex items-center gap-4 text-gray-300">
                            <GraduationCap className="text-[#ffdc36]" size={28} />
                            <p className="text-xl max-w-3xl">
                                Join GUBC — no experience required, just enthusiasm to row and be part of the crew.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content placeholder */}
                <div className="mt-10 mb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Quick highlights with icons */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-black text-white p-6 border-l-4 border-[#ffdc36] flex items-center gap-3">
                                <GraduationCap className="text-[#ffdc36]" />
                                <span className="uppercase tracking-wide">Beginner Friendly</span>
                            </div>
                            <div className="bg-black text-white p-6 border-l-4 border-[#ffdc36] flex items-center gap-3">
                                <Briefcase className="text-[#ffdc36]" />
                                <span className="uppercase tracking-wide">Train & Compete</span>
                            </div>
                            <div className="bg-black text-white p-6 border-l-4 border-[#ffdc36] flex items-center gap-3">
                                <Globe className="text-[#ffdc36]" />
                                <span className="uppercase tracking-wide">All Students Welcome</span>
                            </div>
                            <div className="bg-black text-white p-6 border-l-4 border-[#ffdc36] flex items-center gap-3">
                                <Pencil className="text-[#ffdc36]" />
                                <span className="uppercase tracking-wide">No Experience Needed</span>
                            </div>
                        </div>

                        {/* Interest Form CTA */}
                        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#ffdc36] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <ClipboardList className="mx-auto h-12 w-12 text-[#ffdc36] mb-4" />
                                <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">
                                    Register Your Interest
                                </h2>
                                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                    Fill out our interest form to get the latest updates on taster sessions, recruitment, and joining the club.
                                </p>
                                <div className="w-full max-w-4xl mx-auto h-[600px] sm:h-[800px] bg-white rounded-lg overflow-hidden">
                                    <iframe
                                        src="https://forms.gle/JWopDKhSReH6tH7S8"
                                        className="w-full h-full border-0"
                                        title="GUBC Interest Form"
                                    >
                                        Loading…
                                    </iframe>
                                </div>
                            </div>
                        </div>

                        {/* Training Plan Section */}
                        <div className="mt-16 mb-12">
                            <div className="flex items-center gap-3 mb-8">
                                <CalendarDays className="text-[#ffdc36] h-8 w-8" />
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                                    Sample Training Schedule
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-zinc-900 p-6 border-l-4 border-gray-600 rounded-r-lg">
                                    <h3 className="text-gray-400 font-bold uppercase mb-2 text-lg">Monday</h3>
                                    <p className="text-gray-300">Rest Day</p>
                                </div>
                                <div className="bg-zinc-900 p-6 border-l-4 border-[#ffdc36] rounded-r-lg">
                                    <h3 className="text-[#ffdc36] font-bold uppercase mb-2 text-lg">Tuesday</h3>
                                    <ul className="space-y-1 text-gray-300">
                                        <li><span className="text-white font-semibold">AM:</span> Strength & Conditioning</li>
                                        <li><span className="text-white font-semibold">PM:</span> Circuits / Group Ergs</li>
                                    </ul>
                                </div>
                                <div className="bg-zinc-900 p-6 border-l-4 border-[#ffdc36] rounded-r-lg">
                                    <h3 className="text-[#ffdc36] font-bold uppercase mb-2 text-lg">Wednesday</h3>
                                    <p className="text-gray-300"><span className="text-white font-semibold">PM:</span> Water Session</p>
                                </div>
                                <div className="bg-zinc-900 p-6 border-l-4 border-[#ffdc36] rounded-r-lg">
                                    <h3 className="text-[#ffdc36] font-bold uppercase mb-2 text-lg">Thursday</h3>
                                    <ul className="space-y-1 text-gray-300">
                                        <li><span className="text-white font-semibold">AM:</span> Strength & Conditioning</li>
                                        <li><span className="text-white font-semibold">PM:</span> Erg Session</li>
                                    </ul>
                                </div>
                                <div className="bg-zinc-900 p-6 border-l-4 border-[#ffdc36] rounded-r-lg">
                                    <h3 className="text-[#ffdc36] font-bold uppercase mb-2 text-lg">Friday</h3>
                                    <ul className="space-y-1 text-gray-300">
                                        <li><span className="text-white font-semibold">AM:</span> Erg Session</li>
                                        <li><span className="text-white font-semibold">PM:</span> Water Session</li>
                                    </ul>
                                </div>
                                <div className="bg-zinc-900 p-6 border-l-4 border-[#ffdc36] rounded-r-lg">
                                    <h3 className="text-[#ffdc36] font-bold uppercase mb-2 text-lg">Sat & Sun</h3>
                                    <p className="text-gray-300">Water Sessions</p>
                                </div>
                            </div>
                        </div>

                        <hr className="my-12 border-gray-400" />

                        {/* Next Steps CTA */}
                        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#ffdc36] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">Ready to Apply?</h3>
                                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                    Take the next step by exploring the University of Glasgow&apos;s full prospectus and application resources.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-6">
                                    <a
                                        href="https://www.gla.ac.uk/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-black bg-[#ffdc36] hover:bg-white transition duration-300 shadow-lg uppercase tracking-wider"
                                    >
                                        Visit University of Glasgow Study Page
                                    </a>
                                    <a
                                        href="https://www.ucas.com/explore/unis/e4c66810/university-of-glasgow?studyYear=2026"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-black bg-[#ffdc36] hover:bg-white transition duration-300 shadow-lg uppercase tracking-wider"
                                    >
                                        Apply via UCAS
                                    </a>
                                    <a
                                        href="https://www.commonapp.org/explore/university-glasgow"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-black bg-[#ffdc36] hover:bg-white transition duration-300 shadow-lg uppercase tracking-wider"
                                    >
                                        Apply via Common App
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

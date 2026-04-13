import Image from "next/image";
import { Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-gray-300 py-18">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="relative h-20 w-20 mx-auto mb-6">
                        <Image
                            src="https://nfinlwbvbsoonbxqflvh.supabase.co/storage/v1/object/public/site_images/GUBC_Logo_Clean.png"
                            alt="GUBC Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_40px_rgba(255,215,0,1)]"
                        />
                    </div>
                    <p className="text-white uppercase tracking-wider text-lg mb-2">
                        Glasgow University Boat Club
                    </p>
                    <p className="text-gray-400 uppercase text-sm tracking-wider mb-6">
                        Excellence in rowing since 1867
                    </p>
                    <div className="h-1 w-32 bg-[#ffdc36] mx-auto mb-6"></div>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Glasgow University Boat Club. All
                        rights reserved.
                    </p>
                    <div className="mt-6">
                        <div className="h-0.5 w-24 bg-[#ffdc36] mx-auto mb-4"></div>
                        <p className="text-base text-[#ffdc36] mb-3 font-semibold tracking-wide">
                            Developed by Conor Haughney
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="mailto:cphaughney99@gmail.com"
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#ffdc36]/50 bg-[#ffdc36]/10 text-[#ffdc36] hover:bg-[#ffdc36] hover:text-black transition-colors"
                                aria-label="Email Conor Haughney"
                            >
                                <Mail size={16} />
                                <span className="text-xs sm:text-sm">Email</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/conor-haughney"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#ffdc36]/50 bg-[#ffdc36]/10 text-[#ffdc36] hover:bg-[#ffdc36] hover:text-black transition-colors"
                                aria-label="Conor Haughney on LinkedIn"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.34 18V10.5H5.85V18H8.34ZM7.09 9.48C7.89 9.48 8.39 8.95 8.39 8.28C8.38 7.59 7.89 7.08 7.11 7.08C6.33 7.08 5.81 7.59 5.81 8.28C5.81 8.95 6.31 9.48 7.08 9.48H7.09ZM18 18V13.8C18 11.55 16.8 10.5 15.2 10.5C13.9 10.5 13.31 11.22 12.99 11.73V10.5H10.5C10.53 11.31 10.5 18 10.5 18H12.99V13.81C12.99 13.59 13.01 13.37 13.07 13.21C13.25 12.77 13.66 12.31 14.35 12.31C15.25 12.31 15.61 12.99 15.61 13.98V18H18Z" />
                                </svg>
                                <span className="text-xs sm:text-sm">LinkedIn</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

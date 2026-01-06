import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience similar to Home page */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50"></div>

      {/* Diagonal yellow accent - styled to match the home page hero */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-[#ffdc36] to-[#ffdc36]/80 transform origin-bottom-left skew-y-2 opacity-20"></div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        {/* 404 Display */}
        <h1 className="text-[#ffdc36] text-9xl font-bold mb-4 tracking-tighter opacity-90">
          404
        </h1>

        {/* Thematic Error Message */}
        <h2 className="text-white text-3xl sm:text-4xl uppercase tracking-wider mb-6 font-bold">
          Caught a Crab?
        </h2>

        <div className="h-1 w-24 bg-[#ffdc36] mx-auto mb-8"></div>

        <p className="text-gray-300 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          It looks like you&apos;ve gone off course. The page you are looking
          for has either been moved or doesn&apos;t exist. Let&apos;s get you back in
          the lane.
        </p>

        {/* Action Button - Matches the 'Join Now' button style from page.tsx */}
        <Link
          href="/"
          className="group bg-[#ffdc36] text-black px-10 py-4 uppercase tracking-wider hover:bg-white transition-all duration-300 inline-flex items-center gap-3 font-semibold"
        >
          <ArrowLeft
            className="group-hover:-translate-x-1 transition-transform"
            size={20}
          />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}

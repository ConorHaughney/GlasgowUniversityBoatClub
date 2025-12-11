import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/70"></div>
        {/* Diagonal yellow accent */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-[#ffdc36] to-[#ffdc36]/80 transform origin-bottom-left skew-y-2"></div>
      </div>

      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <div className="inline-block mb-6">
              <div className="bg-[#ffdc36] text-black px-4 py-2 transform -skew-x-12 inline-block">
                <span className="block transform skew-x-12 tracking-wider text-sm uppercase">Since 1877</span>
              </div>
            </div>
            <h1 className="text-white mb-6 leading-tight">
              <span className="block text-6xl sm:text-7xl lg:text-8xl uppercase tracking-tight">Glasgow</span>
              <span className="block text-6xl sm:text-7xl lg:text-8xl uppercase tracking-tight">University</span>
              <span className="block text-6xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#ffdc36]">Boat Club</span>
            </h1>
            <div className="h-1 w-32 bg-[#ffdc36] mb-8"></div>
            <p className="text-white text-xl sm:text-2xl mb-12 max-w-2xl">
              Excellence in rowing. Join Scotland&apos;s premier university rowing club and become part of our legacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/join"
                className="group bg-[#ffdc36] text-black px-10 py-4 uppercase tracking-wider hover:bg-white transition-all duration-300 text-center inline-flex items-center justify-center gap-3"
              >
                <span>Join Now</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                href="/about"
                className="bg-transparent border-2 border-white text-white px-10 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="relative h-20 w-20 mx-auto mb-6">
            <Image
              src="/GUBC_logo_Clean.png"
              alt="GUBC Logo"
              fill
              className="object-contain drop-shadow-[0_0_40px_rgba(255,215,0,1)]"
            />
          </div>
          <p className="text-white uppercase tracking-wider text-lg mb-2">
            Glasgow University Boat Club
          </p>
          <p className="text-gray-400 uppercase text-sm tracking-wider mb-6">
            Excellence in rowing since 1877
          </p>
          <div className="h-1 w-32 bg-[#ffdc36] mx-auto mb-6"></div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Glasgow University Boat Club. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function OurHistoryPage() {
  return (
    <section id="our-history" className="bg-gray-1000 mt-20">
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
              Discover the rich history of Glasgow University Boat Club since 1867.
            </p>
          </div>
        </section>

        {/* Content placeholder */}
        <div className="mt-10 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-400 text-lg">History content coming soon...</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { GraduationCap, Briefcase, Globe, Pencil } from "lucide-react";

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

            {/* Application Steps Overview */}
            <h2 className="text-4xl font-bold text-white mb-8 tracking-tight mt-12">
              Application Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-200">
              {/* Undergraduate Applications */}
              <div>
                <GraduationCap className="h-10 w-10 text-[#ffdc36] mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-[#ffdc36]">Undergraduate Study</h3>
                <p className="mb-4">
                  All applications for full-time undergraduate programmes at the University of Glasgow must be made through the UCAS (Universities and Colleges Admissions Service) website.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Entry Requirements:</strong> Check the specific academic requirements (A-Levels, Highers, IB, etc.) for your chosen programme.</li>
                  <li><strong>Personal Statement:</strong> Prepare a strong personal statement demonstrating your interest and suitability for the course.</li>
                  <li><strong>Key Deadlines:</strong> The main application deadline is typically 15 January for entry in the following academic year.</li>
                </ul>
                <a href="https://www.ucas.com/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-[#ffdc36] hover:text-white transition duration-300">
                  Apply via UCAS →
                </a>
              </div>

              {/* Postgraduate Applications */}
              <div>
                <Briefcase className="h-10 w-10 text-[#ffdc36] mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-[#ffdc36]">Postgraduate Study</h3>
                <p className="mb-4">
                  Applications for taught masters (PGT) and research (PGR) programmes are usually made directly to the University of Glasgow through their online application portal.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Required Documents:</strong> You&apos;ll typically need transcripts, degree certificates, a CV, references, and a research proposal (for PGR).</li>
                  <li><strong>Check Course Pages:</strong> Deadlines and specific requirements vary significantly by programme. Always check the individual course page.</li>
                  <li><strong>Application Fee:</strong> Some programmes may require an application fee.</li>
                </ul>
                <a href="https://www.gla.ac.uk/postgraduate/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-[#ffdc36] hover:text-white transition duration-300">
                  Explore Postgraduate Courses →
                </a>
              </div>
            </div>

            <hr className="my-12 border-gray-700" />

            {/* International Student Information */}
            <div className="md:flex md:items-start md:space-x-12 mt-12">
              <div className="md:w-1/3">
                <Globe className="h-10 w-10 text-[#ffdc36] mb-4" />
                <h3 className="text-3xl font-semibold mb-4 text-[#ffdc36]">International Applicants</h3>
                <p className="text-gray-300 mb-6 md:mb-0">
                  The University of Glasgow welcomes students from over 140 countries. The application process is generally the same as above, but with a few extra considerations.
                </p>
              </div>
              <div className="md:w-2/3 text-gray-200">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mr-3 text-[#ffdc36]">
                      <Pencil className="h-6 w-6" />
                    </div>
                    <div>
                      <strong className="block text-lg font-medium text-white">English Language Requirements</strong>
                      <p>All non-native English speakers must provide proof of English proficiency, typically via IELTS or an accepted equivalent qualification.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mr-3 text-[#ffdc36]">
                      <Pencil className="h-6 w-6" />
                    </div>
                    <div>
                      <strong className="block text-lg font-medium text-white">Visa and Immigration</strong>
                      <p>If successful, you will need to apply for a Student Visa (formerly Tier 4). The University&apos;s International Student Support team can provide guidance on the necessary documentation.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mr-3 text-[#ffdc36]">
                      <Pencil className="h-6 w-6" />
                    </div>
                    <div>
                      <strong className="block text-lg font-medium text-white">Equivalent Qualifications</strong>
                      <p>The University accepts a wide range of international qualifications. Check their country-specific pages for direct equivalencies.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <hr className="my-12 border-gray-400" />

            {/* Next Steps CTA */}
            <div className="text-center py-8 bg-gray-400 rounded-lg">
              <h3 className="text-3xl font-bold text-black mb-4">Ready to Apply?</h3>
              <p className="text-black mb-6 max-w-2xl mx-auto">
                Take the next step by exploring the University of Glasgow&apos;s full prospectus and application resources.
              </p>
              <a
                href="https://www.gla.ac.uk/study/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-black bg-[#ffdc36] hover:bg-yellow-400 transition duration-300 shadow-lg uppercase tracking-wider"
              >
                Visit University of Glasgow Study Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

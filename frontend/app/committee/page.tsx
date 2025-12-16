import { ImageWithFallback } from "@/components/Fallback";
import { Mail } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type CommitteeMember = {
  id: number;
  role: string;
  name: string;
  bio: string;
  photoUrl: string;
  email?: string;
};

async function getCommittee(): Promise<CommitteeMember[]> {
  const res = await fetch(`${API_URL}/api/committee`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Committee() {
  const members = await getCommittee();

  // Guard against missing data
  if (members.length === 0) {
    return (
      <section id="committee" className="bg-gray-1000 mt-20 text-white px-6 py-16">
        <h2 className="text-3xl font-bold">Committee</h2>
        <p className="text-gray-300 mt-2">No committee data available.</p>
      </section>
    );
  }

  const featured = members[1];
  const midTier = [members[3], members[4]].filter(Boolean);
  const secondTier = [members[0], members[5]].filter(Boolean);
  const others = members
    .map((m, i) => ({ m, i }))
    .filter(({ i }) => ![0, 1, 3, 4, 5].includes(i))
    .map(({ m }) => m);
  const firstEight = others.slice(0, 8);
  const lastThree = others.slice(8);

  return (
    <section id="committee" className="bg-gray-1000 mt-20">
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        <section className="relative py-24 bg-black text-white overflow-hidden">
          <div className="absolute top-5 right-5 text-white/5 text-[15rem] uppercase tracking-tight leading-none pointer-events-none">
            Committee
          </div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#ffdc36] transform origin-bottom-left skew-x-6 -translate-x-1/3 opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
            <h1 className="text-white uppercase tracking-tight mb-6">
              <span className="block text-5xl sm:text-6xl lg:text-7xl">Meet The</span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">
                Committee
              </span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl">
              The dedicated team leading Glasgow University Boat Club this year.
            </p>
          </div>
        </section>

        {featured && (
          <div className="mt-10 mb-16">
            <div className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="aspect-square overflow-hidden relative">
                  <ImageWithFallback
                    src={featured.photoUrl}
                    alt={featured.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-10 flex flex-col justify-center">
                  <div className="mb-8">
                    <h3 className="text-black text-4xl uppercase tracking-wide mb-4">
                      {featured.name}
                    </h3>
                    <div className="inline-block bg-black text-[#ffdc36] px-5 py-2 uppercase text-base tracking-wider">
                      {featured.role}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">{featured.bio}</p>
                  {featured.email && (
                    <a
                      href={`mailto:${featured.email}`}
                      className="inline-flex items-center gap-3 text-black hover:text-[#ffdc36] transition-colors uppercase text-base tracking-wider group"
                    >
                      <Mail size={22} />
                      <span>Contact</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10 mb-16 max-w-5xl mx-auto">
          {midTier.map((member) => (
            <div
              key={member.id}
              className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden"
            >
              <div className="aspect-square overflow-hidden relative">
                <ImageWithFallback
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-10">
                <div className="mb-8">
                  <h3 className="text-black text-3xl uppercase tracking-wide mb-4">
                    {member.name}
                  </h3>
                  <div className="inline-block bg-black text-[#ffdc36] px-5 py-2 uppercase text-base tracking-wider">
                    {member.role}
                  </div>
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">{member.bio}</p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-3 text-black hover:text-[#ffdc36] transition-colors uppercase text-base tracking-wider group"
                  >
                    <Mail size={20} />
                    <span>Contact</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-14 max-w-4xl mx-auto">
          {secondTier.map((member) => (
            <div
              key={member.id}
              className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden"
            >
              <div className="aspect-square overflow-hidden relative">
                <ImageWithFallback
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-5">
                  <h3 className="text-black text-2xl uppercase tracking-wide mb-3">
                    {member.name}
                  </h3>
                  <div className="inline-block bg-black text-[#ffdc36] px-4 py-2 uppercase text-sm md:text-base tracking-wider">
                    {member.role}
                  </div>
                </div>
                <p className="text-gray-700 text-base mb-5 leading-relaxed">{member.bio}</p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-black hover:text-[#ffdc36] transition-colors uppercase text-sm md:text-base tracking-wider group"
                  >
                    <Mail size={18} />
                    <span>Contact</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-8">
          {firstEight.map((member) => (
            <div
              key={member.id}
              className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden"
            >
              <div className="aspect-square overflow-hidden relative">
                <ImageWithFallback
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-7">
                <div className="mb-4">
                  <h3 className="text-black text-xl md:text-2xl uppercase tracking-wide mb-3">
                    {member.name}
                  </h3>
                  <div className="inline-block bg-black text-[#ffdc36] px-4 py-1.5 uppercase text-sm md:text-base tracking-wider">
                    {member.role}
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                  {member.bio}
                </p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-black hover:text-[#ffdc36] transition-colors uppercase text-sm md:text-base tracking-wider group"
                  >
                    <Mail size={16} />
                    <span>Contact</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {lastThree.map((member) => (
            <div
              key={member.id}
              className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden"
            >
              <div className="aspect-square overflow-hidden relative">
                <ImageWithFallback
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-7">
                <div className="mb-4">
                  <h3 className="text-black text-xl md:text-2xl uppercase tracking-wide mb-3">
                    {member.name}
                  </h3>
                  <div className="inline-block bg-black text-[#ffdc36] px-4 py-1.5 uppercase text-sm md:text-base tracking-wider">
                    {member.role}
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                  {member.bio}
                </p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-black hover:text-[#ffdc36] transition-colors uppercase text-sm md:text-base tracking-wider group"
                  >
                    <Mail size={16} />
                    <span>Contact</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
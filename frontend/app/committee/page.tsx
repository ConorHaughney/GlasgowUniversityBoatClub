import { ImageWithFallback } from "@/components/Fallback";
import { Mail } from "lucide-react";

export default function Committee() {
  const members = [
    {
      name: "Elise Muscroft",
      position: "Club President",
      email: "gubcpresident1867@gmail.com",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/elise-muscroft.jpg",
    },
    {
      name: "Aoibhinn McConville",
      position: "Club Captain",
      email: "captain-boats@gusa.gla.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/aoibhinn-mcconville.jpg",
    },
    {
      name: "Kirsty McRobb",
      position: "Women's Squad Captain",
      email: "womens.captain@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/kirsty-mcrobb.jpg",
    },
    {
      name: "Philip Williams",
      position: "Treasurer",
      email: "treasurer@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/philip-williams.jpg",
    },
    {
      name: "Elspeth Jolly",
      position: "Secretary",
      email: "secretary@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/elspeth-jolly.jpg",
    },
    {
      name: "Chris Rae",
      position: "Head Coach",
      email: "Christopher.J.Rae@glasgow.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/chris-rae.jpg",
    },
    {
      name: "Itay Yekutieli",
      position: "Men's Squad Captain",
      email: "mens.captain@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/itay-yekutieli.jpg",
    },
    {
      name: "Elliot Mutter",
      position: "Sponsorship & Fundraising",
      email: "fundraising@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/elliot-mutter.jpg",
    },
    {
      name: "Joe Flood",
      position: "Boats & Boathouse Manager",
      email: "equipment@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/joe-flood.jpg",
    },
    {
      name: "Ethan MacLachlan",
      position: "Publicity & Social Media",
      email: "publicity@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/ethan-maclachlan.jpg",
    },
    {
      name: "Naomi McGuire",
      position: "Socials Convenor",
      email: "social@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/naomi-mcguire.jpg",
    },
    {
      name: "Michaela Holms",
      position: "Kit Officer",
      email: "kit@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/michaela-holms.jpg",
    },
    {
      name: "Conor Haughney",
      position: "Welfare Officer",
      email: "welfare@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/conor-haughney.jpg",
    },
    {
      name: "Sarah Brennan",
      position: "Welfare Officer",
      email: "welfare2@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/sarah-brennan.jpg",
    },
    {
      name: "Zoe Cochrane",
      position: "Sustainability Officer",
      email: "sustainability@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/zoe-cochrane.jpg",
    },
    {
      name: "Jess O'Dell",
      position: "Beginner Captain",
      email: "novice@gubc.ac.uk",
      bio: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      photo: "/committee/jess-odell.jpg",
    },
  ];

  const featured = members[1];
  const midTier = [members[3], members[4]];
  const secondTier = [members[0], members[5]];
  const others = [
    members[2],
    members[6],
    members[7],
    members[8],
    members[9],
    members[10],
    members[11],
    members[12],
    members[13],
    members[14],
    members[15],
  ];
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
              <span className="block text-5xl sm:text-6xl lg:text-7xl">
                Meet The
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">
                Committee
              </span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl">
              The dedicated team leading Glasgow University Boat Club this year.
            </p>
          </div>
        </section>

        {/* Club Captain - Featured */}
        <div className="mt-10 mb-16">
          <div className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="aspect-square overflow-hidden relative">
                <ImageWithFallback
                  src={featured.photo}
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
                    {featured.position}
                  </div>
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  {featured.bio}
                </p>
                <a
                  href={`mailto:${featured.email}`}
                  className="inline-flex items-center gap-3 text-black hover:text-[#ffdc36] transition-colors uppercase text-base tracking-wider group"
                >
                  <Mail size={22} />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Treasurer and Secretary */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 max-w-5xl mx-auto">
          {midTier.map((member) => (
            <div
              key={member.name}
              className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden"
            >
              <div className="aspect-square overflow-hidden relative">
                <ImageWithFallback
                  src={member.photo}
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
                    {member.position}
                  </div>
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  {member.bio}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-3 text-black hover:text-[#ffdc36] transition-colors uppercase text-base tracking-wider group"
                >
                  <Mail size={20} />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* President and Coach */}
        <div className="grid md:grid-cols-2 gap-8 mb-14 max-w-4xl mx-auto">
          {secondTier.map((member) => (
            <div
              key={member.name}
              className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden"
            >
              <div className="aspect-square overflow-hidden relative">
                <ImageWithFallback
                  src={member.photo}
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
                    {member.position}
                  </div>
                </div>
                <p className="text-gray-700 text-base mb-5 leading-relaxed">
                  {member.bio}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 text-black hover:text-[#ffdc36] transition-colors uppercase text-sm md:text-base tracking-wider group"
                >
                  <Mail size={18} />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* First 8 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-8">
          {firstEight.map((member) => (
            <div
              key={member.name}
              className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden"
            >
              <div className="aspect-square overflow-hidden relative">
                <ImageWithFallback
                  src={member.photo}
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
                    {member.position}
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                  {member.bio}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 text-black hover:text-[#ffdc36] transition-colors uppercase text-sm md:text-base tracking-wider group"
                >
                  <Mail size={16} />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Last 3 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {lastThree.map((member) => (
            <div
              key={member.name}
              className="group bg-white hover:shadow-2xl transition-all duration-300 border-l-4 border-[#c4a522] hover:border-[#ffdc36] overflow-hidden"
            >
              <div className="aspect-square overflow-hidden relative">
                <ImageWithFallback
                  src={member.photo}
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
                    {member.position}
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                  {member.bio}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 text-black hover:text-[#ffdc36] transition-colors uppercase text-sm md:text-base tracking-wider group"
                >
                  <Mail size={16} />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

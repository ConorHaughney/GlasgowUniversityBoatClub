import {
  Calendar,
  Clock,
  MapPin,
  PartyPopper,
  Trophy,
  Users,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

type EventType = {
  date: string;
  day: string;
  month: string;
  endDate?: string;
  endDay?: string;
  endMonth?: string;
  title: string;
  location: string;
  time: string;
  type: "Competition" | "Social" | "Recruitment" | string;
  description: string;
  featured: boolean;
  icon: typeof Trophy;
  multiDay?: boolean;
};

const events: EventType[] = [
  {
    date: "January 18, 2025",
    day: "18",
    month: "JAN",
    title: "Scottish Indoor Rowing Championships",
    location: "Emirates Arena, Glasgow",
    time: "09:00 - 17:00",
    type: "Competition",
    description: "Annual indoor rowing competition. Open to all members.",
    featured: true,
    icon: Trophy,
  },
  {
    date: "February 1, 2025",
    day: "01",
    month: "FEB",
    title: "Spring Recruitment Drive",
    location: "University Campus",
    time: "12:00 - 16:00",
    type: "Recruitment",
    description: "Taster sessions and club information for new students.",
    featured: false,
    icon: Users,
  },
  {
    date: "February 15, 2025",
    day: "15",
    month: "FEB",
    endDate: "February 16, 2025",
    endDay: "16",
    endMonth: "FEB",
    title: "Head of the Forth",
    location: "Firth of Forth",
    time: "08:00 - 14:00",
    type: "Competition",
    description: "Head race along the Forth. Multiple crew entries planned.",
    featured: false,
    icon: Trophy,
    multiDay: true,
  },
  {
    date: "March 8, 2025",
    day: "08",
    month: "MAR",
    endDate: "March 10, 2025",
    endDay: "10",
    endMonth: "MAR",
    title: "BUCS Regatta",
    location: "Nottingham",
    time: "All Day",
    type: "Competition",
    description:
      "British Universities Championships - our biggest event of the year.",
    featured: true,
    icon: Trophy,
    multiDay: true,
  },
  {
    date: "March 22, 2025",
    day: "22",
    month: "MAR",
    title: "Alumni Dinner",
    location: "University Union",
    time: "19:00 - 23:00",
    type: "Social",
    description: "Annual dinner bringing together current members and alumni.",
    featured: false,
    icon: PartyPopper,
  },
  {
    date: "April 5, 2025",
    day: "05",
    month: "APR",
    endDate: "April 6, 2025",
    endDay: "06",
    endMonth: "APR",
    title: "Scottish Boat Race",
    location: "River Clyde, Glasgow",
    time: "14:00 - 17:00",
    type: "Competition",
    description:
      "Historic race against Edinburgh University. Home water advantage!",
    featured: true,
    icon: Trophy,
    multiDay: true,
  },
];

function getTypeColor(type: string) {
  switch (type) {
    case "Competition":
      return {
        bg: "bg-black",
        text: "text-[#ffdc36]",
        border: "border-[#ffdc36]",
      };
    case "Social":
      return { bg: "bg-[#ffdc36]", text: "text-black", border: "border-black" };
    case "Recruitment":
      return {
        bg: "bg-gray-800",
        text: "text-white",
        border: "border-gray-800",
      };
    default:
      return {
        bg: "bg-gray-500",
        text: "text-white",
        border: "border-gray-500",
      };
  }
}

export default function EventsPage() {
  return (
    <div className="">
      {/* Page wrapper to mirror Committee layout */}
      <section id="events" className="bg-gray-1000 mt-20">
        <div className="mx-auto px-6 sm:px-8 lg:px-10">
          {/* Hero Section (styled like Committee) */}
          <section className="relative py-24 bg-black text-white overflow-hidden">
            <div className="absolute top-5 right-5 text-white/5 text-[15rem] uppercase tracking-tight leading-none pointer-events-none">
              Events
            </div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#ffdc36] transform origin-bottom-left skew-x-6 -translate-x-1/3 opacity-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
              <h1 className="text-white uppercase tracking-tight mb-6">
                <span className="block text-5xl sm:text-6xl lg:text-7xl">Events</span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">Calendar</span>
              </h1>
              <p className="text-gray-300 text-xl max-w-3xl">
                Races, socials, and everything happening at GUBC
              </p>
            </div>
          </section>

          {/* Featured Events */}
          <section className="py-24 bg-gray-1000">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-16">
                <div className="h-1 w-20 bg-[#ffdc36] mb-6" />
                <h2 className="text-white uppercase tracking-tight">
                  <span className="block text-4xl sm:text-5xl lg:text-6xl">
                    Featured
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                    Events
                  </span>
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-24">
                {events
                  .filter((event) => event.featured)
                  .map((event) => {
                    const colors = getTypeColor(event.type);
                    return (
                      <div key={event.date} className="group relative">
                        <div
                          className={`absolute -top-1 -left-1 w-[calc(100%+7px)] h-[calc(100%+7px)] border-4 ${colors.border} -z-10`}
                        />
                        <div
                          className={`${colors.bg} p-8 h-full relative overflow-hidden`}
                        >
                          <div
                            className={`absolute bottom-0 right-0 ${colors.text} opacity-10`}
                          >
                            <event.icon size={200} />
                          </div>

                          <div className="relative">
                            <div className="flex items-start justify-between mb-6">
                              {event.multiDay ? (
                                <div className={`${colors.text} flex items-center gap-3`}>
                                  <div>
                                    <div className="text-6xl uppercase tracking-tighter leading-none mb-2">
                                      {event.day}
                                    </div>
                                    <div className="text-2xl uppercase tracking-wider">
                                      {event.month}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center justify-center px-3">
                                    <ArrowRight size={32} className="mb-1" />
                                    <div className="h-0.5 w-8 bg-current"></div>
                                  </div>
                                  <div>
                                    <div className="text-6xl uppercase tracking-tighter leading-none mb-2">
                                      {event.endDay}
                                    </div>
                                    <div className="text-2xl uppercase tracking-wider">
                                      {event.endMonth}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className={`${colors.text}`}>
                                  <div className="text-6xl uppercase tracking-tighter leading-none mb-2">
                                    {event.day}
                                  </div>
                                  <div className="text-2xl uppercase tracking-wider">
                                    {event.month}
                                  </div>
                                </div>
                              )}
                              <div
                                className={`px-4 py-2 border-2 ${colors.border} uppercase text-sm tracking-wider`}
                              >
                                {event.type}
                              </div>
                            </div>

                            <h3
                              className={`${
                                colors.text === "text-black" ? "text-black" : "text-white"
                              } uppercase tracking-wide text-3xl mb-4 leading-tight`}
                            >
                              {event.title}
                            </h3>
                            <p
                              className={`${
                                colors.text === "text-black" ? "text-gray-700" : "text-gray-300"
                              } text-lg mb-6 leading-relaxed`}
                            >
                              {event.description}
                            </p>

                            <div className="space-y-3">
                              <div
                                className={`flex items-center gap-3 ${
                                  colors.text === "text-black" ? "text-gray-700" : "text-gray-300"
                                }`}
                              >
                                <MapPin size={20} />
                                <span className="text-lg">{event.location}</span>
                              </div>
                              <div
                                className={`flex items-center gap-3 ${
                                  colors.text === "text-black" ? "text-gray-700" : "text-gray-300"
                                }`}
                              >
                                <Clock size={20} />
                                <span className="text-lg">{event.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* All Events Timeline */}
              <div className="mb-16">
                <div className="h-1 w-20 bg-[#ffdc36] mb-6" />
                <h2 className="text-black uppercase tracking-tight">
                  <span className="block text-4xl sm:text-5xl lg:text-6xl">
                    All
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                    Events
                  </span>
                </h2>
              </div>

              {/* Timeline View */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffdc36] hidden md:block" />
                <div className="space-y-0">
                  {events.map((event) => {
                    const colors = getTypeColor(event.type);
                    return (
                      <div key={event.date} className="relative group">
                        <div
                          className={`absolute left-0 top-8 w-4 h-4 ${colors.bg} border-4 border-white rounded-full -translate-x-1.5 hidden md:block z-10`}
                        />
                        <div className="md:ml-12 mb-8">
                          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                            <div className="flex-shrink-0">
                              {event.multiDay ? (
                                <div className={`${colors.bg} ${colors.text} px-6 py-4 flex items-center gap-4 group-hover:scale-105 transition-transform duration-300`}>
                                  <div className="text-center">
                                    <event.icon size={24} className="mb-1" />
                                    <div className="text-3xl uppercase tracking-tight leading-none mb-1">
                                      {event.day}
                                    </div>
                                    <div className="text-xs uppercase tracking-wider">
                                      {event.month}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <ArrowRight size={20} />
                                    <div className="h-px w-6 bg-current mt-1"></div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-3xl uppercase tracking-tight leading-none mb-1">
                                      {event.endDay}
                                    </div>
                                    <div className="text-xs uppercase tracking-wider">
                                      {event.endMonth}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className={`${colors.bg} ${colors.text} w-32 h-32 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                  <event.icon size={32} className="mb-2" />
                                  <div className="text-3xl uppercase tracking-tight leading-none mb-1">
                                    {event.day}
                                  </div>
                                  <div className="text-sm uppercase tracking-wider">
                                    {event.month}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Event Card */}
                            <div className="flex-1 bg-white border-l-4 border-[#ffdc36] p-6 group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <div className="flex-1">
                                  <h3 className="text-black uppercase tracking-wide text-2xl">
                                    {event.title}
                                  </h3>
                                  {event.multiDay && (
                                    <div className="mt-2 inline-flex items-center gap-2 text-[#ffdc36] text-sm uppercase tracking-wider">
                                      <Calendar size={14} />
                                      <span>Multi-Day Event</span>
                                    </div>
                                  )}
                                </div>
                                <div className={`${colors.bg} ${colors.text} px-4 py-2 uppercase text-xs tracking-wider self-start`}>
                                  {event.type}
                                </div>
                              </div>

                              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                                {event.description}
                              </p>

                              <div className="flex flex-wrap gap-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                  <MapPin size={18} />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={18} />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[#ffdc36] transform -skew-y-3 origin-top-right translate-y-1/2 opacity-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Calendar size={64} className="text-[#ffdc36] mx-auto mb-8" />
          <h2 className="text-white uppercase tracking-tight mb-6">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">Never Miss</span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">An Event</span>
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Want to receive event updates and race information? Join our mailing list or follow us on social media.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-[#ffdc36] text-black px-10 py-4 uppercase tracking-wider hover:bg-white transition-colors inline-flex items-center justify-center gap-2 group"
            >
              Get Updates
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#alumni"
              className="border-2 border-[#ffdc36] text-[#ffdc36] px-10 py-4 uppercase tracking-wider hover:bg-[#ffdc36] hover:text-black transition-colors inline-flex items-center justify-center gap-2"
            >
              View Full Calendar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
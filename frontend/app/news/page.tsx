'use client';

import { ArrowRight, Newspaper } from 'lucide-react';
import { ImageWithFallback } from '@/components/Fallback';

type NewsItem = {
  id: string;
  title: string;
  content: string;
  image: string;
  category: 'Race Result' | 'Club Update' | 'Achievement' | 'Event';
  day: string;
  month: string;
  date: string;
};

const CATEGORY_COLORS: Record<NewsItem['category'], { bg: string; text: string }> = {
  'Race Result': { bg: 'bg-black', text: 'text-[#ffdc36]' },
  'Club Update': { bg: 'bg-[#ffdc36]', text: 'text-black' },
  'Achievement': { bg: 'bg-gray-800', text: 'text-white' },
  'Event': { bg: 'bg-gray-600', text: 'text-white' },
};

const NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'GUBC Wins Scottish Indoor Championships',
    content: 'Our rowers dominated the indoor rowing competition with multiple podium finishes across all categories.',
    image: 'https://images.unsplash.com/photo-1599726702015-92f38a6c7fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3dpbmd8ZW58MXx8fHwxNzY1MzIzMzYyfDA&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Race Result',
    day: '18',
    month: 'Jan',
    date: '2025-01-18',
  },
  {
    id: '2',
    title: 'New Boathouse Facilities Completed',
    content: 'After months of renovation, our state-of-the-art boathouse facilities are now open to all members.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxyb3dpbmclMjBib2F0aG91c2V8ZW58MXx8fHwxNzY1MzIzMzYyfDA&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Club Update',
    day: '12',
    month: 'Jan',
    date: '2025-01-12',
  },
  {
    id: '3',
    title: 'Members Achieve National Qualification',
    content: 'Congratulations to our crews who have qualified for the National Rowing Championships.',
    image: 'https://images.unsplash.com/photo-1606041008023-472accd41d82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3dpbmclMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjUzMjMzNjJ8MA&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Achievement',
    day: '08',
    month: 'Jan',
    date: '2025-01-08',
  },
  {
    id: '4',
    title: 'Spring Recruitment Drive Launches',
    content: 'Join us for our Spring recruitment drive with free taster sessions for all interested students.',
    image: 'https://images.unsplash.com/photo-1552674605-5defe6aa44bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3dpbmclMjBuZXclMjBtZW1iZXJzfGVufDF8fHx8MTc2NTMyMzM2Mnww&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Event',
    day: '01',
    month: 'Feb',
    date: '2025-02-01',
  },
];

function getCategoryColor(category: NewsItem['category']) {
  return CATEGORY_COLORS[category];
}

function NewsCard({ item }: { item: NewsItem }) {
  const colors = getCategoryColor(item.category);

  return (
    <div className="group relative">
      {/* Decorative Border */}
      <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[#ffdc36] -z-10"></div>

      <div className="bg-white overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden h-64">
          {/* <ImageWithFallback
            src={item.image}
            alt={item.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          /> */}
          {/* Diagonal Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent"></div>

          {/* Date Badge */}
          <div className="absolute bottom-4 left-4 bg-[#ffdc36] text-black px-4 py-2 flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl uppercase tracking-tight leading-none">
                {item.day}
              </div>
              <div className="text-xs uppercase tracking-wider">{item.month}</div>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <div
              className={`${colors.bg} ${colors.text} px-3 py-1 uppercase text-xs tracking-wider`}
            >
              {item.category}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col border-l-4 border-[#ffdc36]">
          <h3 className="text-black uppercase tracking-wide text-xl mb-3 leading-tight group-hover:text-[#ffdc36] transition-colors">
            {item.title}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4 flex-1">{item.content}</p>
          <div className="flex items-center gap-2 text-black group-hover:text-[#ffdc36] uppercase text-xs tracking-wider transition-colors cursor-pointer">
            <span>Read More</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <section id="news" className="bg-gray-1000 mt-20">
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        {/* Hero Section */}
        <section className="relative py-24 bg-black text-white overflow-hidden">
          <div className="absolute top-5 right-5 text-white/5 text-[15rem] uppercase tracking-tight leading-none pointer-events-none">
            News
          </div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#ffdc36] transform origin-bottom-left skew-x-6 -translate-x-1/3 opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
            <h1 className="text-white uppercase tracking-tight mb-6">
              <span className="block text-5xl sm:text-6xl lg:text-7xl">
                Latest
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">
                News
              </span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl">
              Stay updated with the latest news from Glasgow University Boat Club.
            </p>
          </div>
        </section>

        {/* Recent News Grid */}
        <section className="py-24 bg-gray-1000">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
              <h2 className="text-white uppercase tracking-tight">
                <span className="block text-4xl sm:text-5xl lg:text-6xl">Recent</span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                  Updates
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {NEWS.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="relative py-32 bg-grey-1000 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {/* <ImageWithFallback
              src="https://images.unsplash.com/photo-1678380051649-4a393ef35e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3dpbmclMjB0ZWFtJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY1MzIzMzYyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="GUBC News"
              className="w-full h-full object-cover"
            /> */}
          </div>
          <div className="absolute inset-0 bg-[#ffdc36] transform skew-y-3 origin-bottom-left opacity-10"></div>

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <Newspaper size={64} className="text-[#ffdc36] mx-auto mb-8" />
            <h2 className="text-white uppercase tracking-tight mb-8">
              <span className="block text-4xl sm:text-5xl lg:text-6xl">Stay In</span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#ffdc36]">
                The Loop
              </span>
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest race results, club news, and
              exclusive updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-6 py-4 bg-white text-black uppercase tracking-wider placeholder:text-gray-400 placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#ffdc36] flex-1 max-w-md"
              />
              <button className="bg-[#ffdc36] text-black px-10 py-4 uppercase tracking-wider hover:bg-white transition-colors inline-flex items-center justify-center gap-2 group">
                Subscribe
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
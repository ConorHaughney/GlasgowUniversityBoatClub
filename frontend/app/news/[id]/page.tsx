import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageWithFallback } from "@/components/Fallback";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type Article = {
  id: number;
  title: string;
  body: string;
  image_url?: string;
  author?: string;
  published_at?: string;
};

async function fetchById(id: number): Promise<Article | null> {
  const res = await fetch(`${API}/api/news/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function NewsArticle(props: PageProps) {
  const p = await props.params;
  const idParam = p?.id;
  const id = idParam ? Number(idParam) : NaN;
  if (!Number.isFinite(id)) return notFound();

  const article = await fetchById(id);
  if (!article) return notFound();

  return (
    <section className="bg-gray-1000 mt-20">
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

      {/* Article content */}
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffdc36] text-black uppercase text-sm font-semibold tracking-wider hover:bg-[#e6c82f] transition-colors duration-300"
            >
              <span>← Back to News</span>
            </Link>
          </div>
          <div className="py-4"></div>
          {/* Article title */}
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-8 leading-tight ml-2">
            {article.title}
          </h1>
          {/* Article metadata */}
          <div className="mb-8 flex items-center gap-4 text-gray-400 uppercase text-sm tracking-wider ml-4">
            <span>{article.author ?? "GUBC"}</span>
            <span className="text-[#ffdc36]">•</span>
            <time>{formatDate(article.published_at)}</time>
          </div>
          {/* Featured image */}
          {article.image_url && (
            <div className="relative w-full h-96 mb-10 overflow-hidden border-l-4 border-[#c4a522]">
              <ImageWithFallback
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover transition-all duration-500"
              />
            </div>
          )}

          {/* Article body */}
          <article className="bg-white text-black p-8 md:p-12 border-l-4 border-[#c4a522]">
            <div
              className="prose prose-lg max-w-none
                prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-black
                prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-[#c4a522] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-black prose-strong:font-bold
                prose-ul:list-disc prose-ul:ml-6 prose-ul:text-gray-800
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:text-gray-800
                prose-img:w-full prose-img:my-8
                prose-blockquote:border-l-4 prose-blockquote:border-[#ffdc36] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700"
              dangerouslySetInnerHTML={{ __html: article.body ?? "" }}
            />
          </article>
        </div>
      </div>
      <div className="pt-10"></div>
      </div>
    </section>
  );
}

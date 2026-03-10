import { notFound } from 'next/navigation';
import Link from 'next/link';
import { query, queryOne } from '@/lib/db';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await queryOne('SELECT title, excerpt FROM news WHERE slug = ?', [slug]);
  if (!article) return { title: 'Not Found' };
  return {
    title: `${article.title} - Jantralkampa`,
    description: article.excerpt || article.title,
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const article = await queryOne('SELECT * FROM news WHERE slug = ? AND is_published = 1', [slug]);

  if (!article) notFound();

  return (
    <>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <Link href="/news" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-6 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to News
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 font-['Outfit']">{article.title}</h1>
          <div className="text-emerald-200 text-sm">
            Published on {new Date(article.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {article.image && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img src={article.image} alt={article.title} className="w-full h-auto" />
            </div>
          )}
          <div className="prose prose-lg max-w-none prose-emerald">
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{article.content}</p>
          </div>
        </div>
      </section>
    </>
  );
}

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        // If data is an array, set it; otherwise maybe handle errors
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch news', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-['Outfit']">Village News</h1>
          <p className="text-emerald-100/80 text-xl">Stay informed about village developments and updates</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-700">Loading news...</h3>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-700">No news articles yet</h3>
              <p className="text-gray-400 mt-2">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className={`glass-card overflow-hidden group animate-fade-in-up ${i < 3 ? `animate-delay-${(i + 1) * 100}` : ''}`}
                >
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-5xl relative overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      '📰'
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-emerald-600 font-medium mb-2">
                      {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3">{item.excerpt || item.content}</p>
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium mt-3">
                      Read More
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
